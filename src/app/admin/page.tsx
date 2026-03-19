'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { getAllUsers, updateUserRole } from '@/lib/actions/admin';
import styles from './admin.module.css';
import { Shield, User, Mail, Calendar, ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';

interface UserData {
  id: number;
  email: string;
  role: string | null;
  isVerified: boolean | null;
  createdAt: string | null;
}

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [wizards, setWizards] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWizards = async () => {
    setLoading(true);
    const res = await getAllUsers();
    if (res.success && res.users) {
      setWizards(res.users);
    } else {
      setError(res.error || 'Failed to summon wizards');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/');
      } else if (user.role !== 'admin') {
        router.push('/');
      }
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) fetchWizards();
  }, [user]);

  const handleRoleToggle = async (id: number, currentRole: string | null) => {
    const newRole = currentRole === 'admin' ? 'wizard' : 'admin';
    const res = await updateUserRole(id, newRole);
    if (res.success) {
      fetchWizards();
    }
  };

  if (isLoading || loading) {
    return <div className={styles.loading}>Summoning the Council... ✨</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => router.push('/')} className={styles.backBtn}>
          <ArrowLeft size={20} /> Back to Academy
        </button>
        <div className={styles.titleGroup}>
          <Shield size={40} className={styles.icon} />
          <h1>The Magic Council</h1>
        </div>
        <button onClick={fetchWizards} className={styles.refreshBtn}>
          <RefreshCw size={20} /> Refresh
        </button>
      </header>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Wizard</th>
              <th>Role</th>
              <th>Status</th>
              <th>Inscribed At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {wizards.map((w) => (
              <tr key={w.id}>
                <td className={styles.userCell}>
                  <User size={16} /> {w.email}
                </td>
                <td className={styles.roleCell}>
                  <span className={w.role === 'admin' ? styles.adminBadge : styles.wizardBadge}>
                    {w.role === 'admin' ? <ShieldCheck size={14} /> : null}
                    {w.role || 'wizard'}
                  </span>
                </td>
                <td className={styles.statusCell}>
                  {w.isVerified ? 'Verified ✨' : 'Unverified 🌫️'}
                </td>
                <td className={styles.dateCell}>
                  {w.createdAt ? new Date(w.createdAt).toLocaleDateString() : 'Ancient'}
                </td>
                <td>
                  <button 
                    onClick={() => handleRoleToggle(w.id, w.role)}
                    className={styles.actionBtn}
                  >
                    {w.role === 'admin' ? 'Downgrade' : 'Promote'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
