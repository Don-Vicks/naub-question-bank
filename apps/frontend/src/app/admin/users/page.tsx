'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { Search, ArrowUp, ArrowDown } from 'lucide-react';
import { api, AdminUserItem, PaginatedResponse } from '@/lib/api';

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const { data, isLoading } = useQuery<PaginatedResponse<AdminUserItem>>({
    queryKey: ['admin', 'users', search],
    queryFn: () => api.adminUsers({ search: search || undefined }),
  });

  const promoteMutation = useMutation({
    mutationFn: (id: string) => api.adminPromoteUser(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }); queryClient.invalidateQueries({ queryKey: ['admin', 'overview'] }); },
  });

  const demoteMutation = useMutation({
    mutationFn: (id: string) => api.adminDemoteUser(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }); queryClient.invalidateQueries({ queryKey: ['admin', 'overview'] }); },
  });

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setSearch(searchInput); };

  const users = data?.items ?? [];

  return (
    <div className="page-desktop">
      <div className="mb-5">
        <h1 className="text-title text-ink">Users</h1>
        <p className="text-body text-muted mt-1">{data?.total ?? '\u2014'} registered users</p>
      </div>

      <form onSubmit={handleSearch} className="relative mb-5 max-w-lg">
        <Search size={16} strokeWidth={1.75} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted/50" />
        <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search users..." className="input-field pl-11" />
      </form>

      <div className="overflow-hidden rounded-card-xl border border-line bg-white shadow-card">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-line-light bg-paper-warm">
              <th className="px-5 py-3 text-overline text-muted">User</th>
              <th className="hidden px-5 py-3 text-overline text-muted lg:table-cell">Joined</th>
              <th className="hidden px-5 py-3 text-overline text-muted lg:table-cell">Papers</th>
              <th className="px-5 py-3 text-overline text-muted">Role</th>
              <th className="px-5 py-3 text-overline text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="py-12 text-center"><div className="h-5 w-5 animate-spin rounded-full border-2 border-army border-t-transparent mx-auto" /></td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={5} className="py-12 text-center text-body text-muted">No users found.</td></tr>
            ) : (
              users.map((user, i) => (
                <tr key={user.id} className={clsx('transition-colors hover:bg-paper', i < users.length - 1 && 'border-b border-line-light')}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-army text-[11px] font-bold text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-ink">{user.name}</p>
                        <p className="text-[11px] text-muted">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-5 py-3.5 text-muted lg:table-cell">{new Date(user.joinedAt).toLocaleDateString()}</td>
                  <td className="hidden px-5 py-3.5 text-muted lg:table-cell">{user.papersUploaded}</td>
                  <td className="px-5 py-3.5">
                    <span className={user.role === 'admin' ? 'badge-army' : 'badge-muted'}>{user.role}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => user.role === 'admin' ? demoteMutation.mutate(user.id) : promoteMutation.mutate(user.id)}
                      disabled={promoteMutation.isPending || demoteMutation.isPending}
                      className={clsx(
                        'flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[12px] font-semibold transition-all disabled:opacity-50',
                        user.role === 'admin' ? 'border-army-200 text-army hover:bg-army-50' : 'border-verified-200 text-verified hover:bg-verified-50',
                      )}
                    >
                      {user.role === 'admin' ? <><ArrowDown size={13} strokeWidth={2} /> Demote</> : <><ArrowUp size={13} strokeWidth={2} /> Promote</>}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
