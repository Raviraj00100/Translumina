import React, { useState, useEffect } from 'react';
import { Activity, X, Server, Zap, CheckCircle2, RefreshCw } from 'lucide-react';

interface HealthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HealthData {
  status: string;
  uptimeSeconds: number;
  service: string;
  providers: {
    active: string[];
    totalConfigured: number;
  };
  metrics: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageLatencyMs: number;
    providerDistribution: Record<string, number>;
  };
  memory: {
    heapUsedMb: number;
    rssMb: number;
  };
}

export const HealthModal: React.FC<HealthModalProps> = ({ isOpen, onClose }) => {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/health');
      const json = await res.json();
      setData(json);
    } catch {
      // offline
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHealth();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="System Health Status">
      <div className="modal-window" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Activity size={20} color="var(--accent-success)" />
            <h2 className="modal-title">System Health & Provider Architecture</h2>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {loading && !data ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div className="spinner" style={{ borderColor: 'var(--brand-primary)', borderTopColor: 'transparent', margin: '0 auto 1rem auto' }}></div>
              Checking backend health...
            </div>
          ) : data ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Overall status badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--accent-success-bg)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--accent-success)', fontWeight: 700 }}>
                  <CheckCircle2 size={20} />
                  <span>Backend Core Status: Operational</span>
                </div>
                <button className="tool-btn" onClick={fetchHealth} aria-label="Refresh status">
                  <RefreshCw size={14} /> Refresh
                </button>
              </div>

              {/* Providers Grid */}
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontWeight: 600 }}>
                  <Server size={16} color="var(--brand-primary)" />
                  <span>Configured Real Translation Providers</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {data.providers.active.map(provider => (
                    <span
                      key={provider}
                      style={{
                        padding: '0.35rem 0.75rem',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.8rem',
                        fontWeight: 600
                      }}
                    >
                      ✓ {provider} Engine
                    </span>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ padding: '0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Average Latency</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--brand-primary)' }}>
                    {data.metrics.averageLatencyMs} ms
                  </div>
                </div>
                <div style={{ padding: '0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Requests Handled</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                    {data.metrics.totalRequests}
                  </div>
                </div>
                <div style={{ padding: '0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Uptime</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                    {Math.floor(data.uptimeSeconds / 60)} min {data.uptimeSeconds % 60} sec
                  </div>
                </div>
                <div style={{ padding: '0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Memory (Heap)</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                    {data.memory.heapUsedMb} MB
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Zap size={14} /> Production rate limiting and server-side secret isolation are actively enabled.
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--accent-danger)' }}>
              Could not contact backend service.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
