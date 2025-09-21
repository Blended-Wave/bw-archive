'use client'

import styles from '@/styles/MemberManagement.module.css';
import MemberTable from '@/components/MemberTable';
import MemberAddModal from '@/components/MemberAddModal'; // 분리된 모달 import
import MemberEditModal from '@/components/MemberEditModal'; // 분리된 모달 import
import { useMemo, useState, useEffect } from 'react';
import api from '@/lib/axios';
import { CellProps } from 'react-table';

interface Member {
  user_id: number;
  // ... other properties
  status: string;
  avatar_image_url: string;
  nickname: string;
  roles: number[]; // API 응답이 roles 임을 가정
  twitter_url: string;
  instar_url: string;
  works_count: number;
}

// Add/Edit 모달에서 사용할 데이터 타입들
interface AddMemberData {
  login_id: string;
  password?: string;
  nickname: string;
  avatar_image_url?: string;
  role_ids: number[];
  twitter_url?: string;
  instar_url?: string;
}

interface EditMemberData {
    user_id?: number;
    nickname: string;
    avatar_image_url?: string;
    role_ids: number[];
    twitter_url?: string;
    instar_url?: string;
    works_count?: number;
    status?: string;
}


export default function MemberManagement() {
  const [data, setData] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<EditMemberData | null>(null);

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
          return (
            <img 
              src={imageUrl} 
              alt="Avatar" 
              style={{ 
                width: 120, 
                height: 120, 
                objectFit: 'fill' 
              }} 
            />
          );
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
          <div className={styles.action_buttons}>
            {cell.row.original.status === 'inactive' ? (
              // 비활성화 상태일 때: 바로 삭제 / 복구 버튼
              <>
                <button
                  className={styles.restore_button}
                  onClick={() => restoreMember(cell.row.original.user_id)}
                >
                  복구
                </button>
                <button
                  className={styles.hard_delete_button}
                  onClick={() => handleHardDelete(cell.row.original.user_id)}
                >
                  바로 삭제
                </button>
              </>
            ) : (
              // 활성 상태일 때: 수정 / 삭제 버튼
              <>
                <button
                  className={styles.edit_button}
                  onClick={() => handleEditClick(cell.row.original.user_id)}
                >
                  수정
                </button>
                <button
                  className={styles.delete_button}
                  onClick={() => deleteMember(cell.row.original.user_id)}
                >
                  삭제
                </button>
              </>
            )}
          </div>
        ),
      },
    ],
    [data]
  );

  const handleEditClick = async (userId: number) => {
    try {
      const response = await api.get<Member>(`/admin/users/${userId}`);
      const memberDataForModal: EditMemberData = {
          ...response.data,
          role_ids: response.data.roles,
      };
      setEditingMember(memberDataForModal);
      setIsEditModalOpen(true);
    } catch (error) {
      console.error("Error fetching user data for edit:", error);
      alert("사용자 정보를 불러오는 데 실패했습니다.");
    }
  };

  // 멤버 '추가' 핸들러
  const handleAddNewMember = async (memberData: AddMemberData, avatarFile?: File) => {
    try {
      let avatarUrl = memberData.avatar_image_url || "";
      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar_url', avatarFile);
        const response = await api.post('/upload/files?type=avatar', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        avatarUrl = response.data.avatar_url;
      }

      // 'role_ids'를 'roles'로 매핑하여 백엔드 DTO와 맞춤
      const { role_ids, ...restOfMemberData } = memberData;
      const finalMemberData = { 
        ...restOfMemberData,
        roles: role_ids,
        avatar_url: avatarUrl // 필드명 avatar_url로 변경
      };
      
      delete finalMemberData.avatar_image_url; // 혹시 모를 기존 필드 삭제

      await api.post('/admin/user_add', finalMemberData);
      setIsAddModalOpen(false);
      
      alert('성공적으로 추가되었습니다.');
      fetchData();
    } catch (error: any) {
      console.error('Error saving member:', error);
      if (error.response && error.response.data) {
        const { code, message } = error.response.data;
        if (code === 'USER4007' || code === 'USER4008') {
          alert(message); // 백엔드에서 보낸 중복 관련 메시지를 그대로 표시
        } else {
          alert('멤버 정보 저장에 실패했습니다. : ' + error);
        }
      } else {
        alert('멤버 정보 저장에 실패했습니다. : ' + error);
      }
    }
  };

  // 멤버 '수정' 핸들러
  const handleUpdateMember = async (memberData: EditMemberData, avatarFile?: File) => {
    try {
        let avatarUrl = memberData.avatar_image_url || "";
        if (avatarFile) {
            const formData = new FormData();
            formData.append('avatar_url', avatarFile);
            const response = await api.post('/upload/files?type=avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            avatarUrl = response.data.avatar_url;
        }

        // 'role_ids'를 'roles'로 매핑하고, 업데이트에 불필요한 필드들을 제거
        const { 
            role_ids, 
            user_id, 
            works_count, // UserEntity에 없는 필드
            status,      // UserEntity에 있지만, 이 API로 수정하지 않는 필드
            ...restOfMemberData 
        } = memberData;

        const finalMemberData = {
            ...restOfMemberData,
            roles: role_ids,
            avatar_url: avatarUrl
        };

        delete finalMemberData.avatar_image_url; 

        await api.patch(`/admin/user_modify/${user_id}`, finalMemberData);
        setIsEditModalOpen(false);

        alert('성공적으로 수정되었습니다.');
      fetchData();
    } catch (error: any) {
      console.error('Error saving member:', error);
      if (error.response && error.response.data) {
        const { code, message } = error.response.data;
        if (code === 'USER4007' || code === 'USER4008') {
          alert(message); // 백엔드에서 보낸 중복 관련 메시지를 그대로 표시
        } else {
          alert('멤버 정보 저장에 실패했습니다. : ' + error);
        }
      } else {
        alert('멤버 정보 저장에 실패했습니다. : ' + error);
      }
    }
  };

  const handleHardDelete = async (userId: number) => {
    if (window.confirm('정말로 이 멤버를 영구적으로 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
      try {
        await api.delete(`/admin/hard_delete_user/${userId}`);
        fetchData(); // 목록 새로고침
      } catch (error) {
        console.error('Error hard deleting user:', error);
        alert('멤버를 영구적으로 삭제하는 데 실패했습니다.');
      }
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
      <button className={styles.add_button} onClick={() => setIsAddModalOpen(true)}> + 멤버 추가 </button>
      <MemberTable columns={columns} data={data} getRowProps={row => ({ className: row.original.status === 'inactive' ? styles.inactive_row : '' })} />
      
      {/* 추가 모달 */}
      <MemberAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddNewMember}
      />
      
      {/* 수정 모달 */}
      <MemberEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdateMember}
        initialData={editingMember}
      />
    </div>
  );
}
