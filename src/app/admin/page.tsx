'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { getAllUsers, updateUserRole, addWizard } from '@/lib/actions/admin';
import styles from './admin.module.css';
import { Shield, User, Mail, Calendar, ShieldCheck, ArrowLeft, RefreshCw, UserPlus, X } from 'lucide-react';

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
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWizard, setNewWizard] = useState({ email: '', password: '', role: 'wizard' });

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

  const handleAddEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await addWizard(newWizard.email, newWizard.password, newWizard.role);
    if (res.success) {
      setNewWizard({ email: '', password: '', role: 'wizard' });
      setShowAddForm(false);
      fetchWizards();
    } else {
      setError(res.error || 'Failed to enroll wizard');
    }
  };

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

      <div className={styles.councilActions}>
        <button 
          className={styles.addBtn}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? <X size={20} /> : <UserPlus size={20} />}
          {showAddForm ? 'Cancel Enrollment' : 'Enroll New Wizard'}
        </button>
      </div>

      {showAddForm && (
        <form className={styles.addForm} onSubmit={handleAddEnrollment}>
          <div className={styles.formGrid}>
            <input 
              type="email" 
              placeholder="Wizard Email" 
              required 
              value={newWizard.email}
              onChange={(e) => setNewWizard({ ...newWizard, email: e.target.value })}
              className={styles.input}
            />
            <input 
              type="password" 
              placeholder="Magic Password" 
              required 
              value={newWizard.password}
              onChange={(e) => setNewWizard({ ...newWizard, password: e.target.value })}
              className={styles.input}
            />
            <select 
              value={newWizard.role}
              onChange={(e) => setNewWizard({ ...newWizard, role: e.target.value })}
              className={styles.select}
            >
              <option value="wizard">Academy Wizard</option>
              <option value="admin">Council Member</option>
            </select>
          </div>
          <button type="submit" className={styles.submitBtn}>
            Inscribe into Ledger
          </button>
        </form>
      )}

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
