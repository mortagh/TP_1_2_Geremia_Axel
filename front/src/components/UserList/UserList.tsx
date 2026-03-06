import { useEffect, useState } from 'react';
import styles from './UserList.module.css';
import { type User, deleteUser, getUsers } from '../../services/userService';
import { Button } from '../ui/Button/Button';
import { Input } from '../ui/Input/Input';
import UserForm from '../UserForm';
import { Select } from '../ui/Select/Select';


export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsers(page, 5, search);
      setUsers(response.data);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError("Impossible de lire ce parchemin magique.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const filteredUsers = users.filter(user => {
    if (roleFilter === 'all') return true;
    return user.role === roleFilter;
  });

const handleDelete = async (id: string) => {
  const confirmed = window.confirm("Par ma barbe ! Voulez-vous vraiment bannir ce héros de nos rangs ?");
  
  if (confirmed) {
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (err) {
      console.error("Erreur lors du bannissement");
    }
  }
};

  const handleEdit = (user: User) => {
    setUserToEdit(user);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setUserToEdit(null);
    fetchUsers();
  };


 return (
    <div className={styles.container}>
      <h2 className={styles.title}>Quête : Recenser les Héros d'Azeroth</h2>

      {showForm ? (
        <UserForm 
          userToEdit={userToEdit} 
          onSuccess={handleFormSuccess} 
          onCancel={() => { setShowForm(false); setUserToEdit(null); }} 
        />
      ) : (
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <Button onClick={() => setShowForm(true)}>+ Enrôler un nouveau Héros</Button>
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <div style={{ flex: 2 }}>
          <Input 
            placeholder="Rechercher (ex: Hurlorage...)" 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <Select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            options={[
              { value: 'all', label: 'Tous les rangs' },
              { value: 'admin', label: 'Généraux (Admin)' },
              { value: 'user', label: 'Soldats (User)' }
            ]}
          />
        </div>
      </div>

      {loading && <p className={styles.statusMessage}>Lecture des glyphes en cours...</p>}
      
      {!loading && (
        <ul className={styles.list}>
          {filteredUsers.length === 0 ? (
            <p className={styles.statusMessage}>Aucun héros ne correspond.</p>
          ) : (
            filteredUsers.map((user) => (
              <li key={user._id} className={styles.listItem} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>- {user.name}</strong> <br/>
                  <span className={styles.roleTag}> Missive : {user.email} | Rang : {user.role === 'admin' ? 'Général' : 'Soldat'}</span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Button onClick={() => handleEdit(user)} style={{ padding: '4px 10px', fontSize: '12px' }}>Éditer</Button>
                  <Button onClick={() => handleDelete(user._id)} style={{ padding: '4px 10px', fontSize: '12px', backgroundColor: '#333' }}>Bannir</Button>
                </div>
              </li>
            ))
          )}
        </ul>
      )}

      <div className={styles.controls}>
        <Button onClick={() => setPage(p => p - 1)} disabled={page === 1}>&lt; Précédent</Button>
        <span className={styles.paginationInfo}>Feuillet {page} sur {totalPages || 1}</span>
        <Button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}>Suivant &gt;</Button>
      </div>
    </div>
  );
}