'use client'

import styles from '@/styles/MemberManagement.module.css';
import MemberTable from '@/components/MemberTable';
import MemberAddModal from '@/components/MemberAddModal';
import { useMemo, useState, useEffect } from 'react';
import api from '@/lib/axios';
import { CellProps } from 'react-table';

interface Member {
  status: string;
  user_id: number;
  avatar_image_url: string;
  nickname: string;
  roles: number[];
  twitter_url: string;
  instar_url: string;
  works_count: number;
}

// MemberAddModal에서 받을 데이터 타입
interface NewMemberData {
  nickname: string;
  avatar_image_url?: string;
  role_ids: number[];
  twitter_url?: string;
  instar_url?: string;
  // password는 추가 시에만 필요
  password?: string;
}

export default function MemberManagement() {
  const [data, setData] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get<Member[]>("/admin/users");
      setData(response.data);
      setError(null);
    } catch (error) {
      setError("멤버 목록을 불러오는 데 실패했습니다.");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = useMemo(
    () => [
      { Header: 'ID', accessor: 'user_id' },
      {
        Header: '아바타',
        accessor: 'avatar_image_url',
        Cell: ({ value }: { value?: string }) => {
          // value가 유효한 URL이면 그대로 사용, 아니면 기본 이미지 표시
          const imageUrl = value && value !== "default avatar" ? value : "/admin_icon/alt_img.svg";
          return <img src={imageUrl} alt="Avatar" style={{ maxWidth: 120, maxHeight: 120, objectFit: 'cover' }} />;
        }
      },
      { Header: '닉네임', accessor: 'nickname' },
      {
        Header: '역할',
        accessor: 'roles',
        Cell: ({ value }: { value: number[] }) => (
          <div className={styles.role_container}>
            {value.includes(1) && <img src="/admin_icon/illustrator_icon.svg" />}
            {value.includes(2) && <img src="/admin_icon/songwriter_icon.svg" />}
            {value.includes(3) && <img src="/admin_icon/animator_icon.svg" />}
            {value.includes(4) && <img src="/admin_icon/writer_icon.svg" />}
          </div>
        ),
      },
      { Header: '트위터', accessor: 'twitter_url' },
      { Header: '인스타그램', accessor: 'instar_url' },
      { Header: '작업물 수', accessor: 'works_count' },
      {
        Header: '작업',
        Cell: ({ cell }: CellProps<{ user_id: number; status: string }>) => (
          cell.row.original.status === 'inactive' ? (
            <button
              className={styles.restore_button}
              onClick={() => restoreMember(cell.row.original.user_id)}
            >
              복구
            </button>
          ) : (
            <button
              className={styles.delete_button}
              onClick={() => deleteMember(cell.row.original.user_id)}
            >
              삭제
            </button>
          )
        ),
      },
    ],
    [data] // data가 변경될 때 컬럼을 다시 계산하도록 추가
  );

  const handleAddMember = async (newMember: NewMemberData, avatarFile?: File) => {
    try {
      let avatarUrl = "";
      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar_url', avatarFile);
        const response = await api.post('/upload/files?type=avatar', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        avatarUrl = response.data.avatar_url;
      }

      const memberDataWithAvatar = { ...newMember, avatar_image_url: avatarUrl };

      await api.post('/admin/user_add', memberDataWithAvatar);
      setIsModalOpen(false);
      fetchData(); // 목록 새로고침
    } catch (error) {
      console.error('Error adding member:', error);
      alert('멤버 추가에 실패했습니다.');
    }
  };

  const deleteMember = async (userId: number) => {
    try {
      await api.patch(`/admin/delete_user/${userId}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const restoreMember = async (userId: number) => {
    try {
      await api.patch(`/admin/cancle_delete_user/${userId}`);
      fetchData();
    } catch (error) {
      console.error('Error restoring user:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.managementContainer}>
      <h1 className={styles.title}>멤버 관리</h1>
      <p>
        아바타, 직업군, SNS 링크 등은 클릭하여 수정 가능합니다.<br />
        ID(자동생성), 닉네임은 데이터 혼동을 방지하기 위하여 처음 생성 이후 직접
        데이터베이스를 수정하는 방식 외에는 수정이 불가능합니다.
      </p>
      <button className={styles.add_button} onClick={() => setIsModalOpen(true)}> + 멤버 추가 </button>
      <MemberTable columns={columns} data={data} getRowProps={row => ({ className: row.original.status === 'inactive' ? styles.inactive_row : '' })} />
      <MemberAddModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddMember}
      />
    </div>
  );
}
