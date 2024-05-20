import styles from '@/styles/MemberManagement.module.css';
import MemberTable from '@/components/MemberTable';
import MemberAddModal from '@/components/MemberAddModal';
import { useMemo, useState } from 'react';

export default function MemberManagement() {
  const [data, setData] = useState([
    {
      id: 1,
      avatar_image_url: 'https://via.placeholder.com/150',
      nickname: '',
      role: '',
      twitter_url: '',
      instar_url: '',
      works: '',
    },
    {
      id: 2,
      avatar_image_url: 'https://via.placeholder.com/150',
      nickname: '',
      role: '',
      twitter_url: '',
      instar_url: '',
      works: '',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = useMemo(
    () => [
      { Header: 'ID', accessor: 'id' },
      {
        Header: 'Avatar',
        accessor: 'avatar_image_url',
        Cell: ({ value }) => (
          <img src={value} alt="Avatar" style={{ width: 142, height: 142 }} />
        ),
      },
      { Header: 'Nickname', accessor: 'nickname' },
      { Header: 'Role', accessor: 'role' },
      { Header: 'Twitter', accessor: 'twitter_url' },
      { Header: 'Instagram', accessor: 'instar_url' },
      { Header: 'Works', accessor: 'works' },
      {
        Header: 'Delete',
        accessor: 'delete',
        Cell: ({ cell }) => (
          <button
            onClick={() => deleteMember(cell.row.original.id)}
            className={styles.delete_button}
          >
            삭제
          </button>
        ),
      },
    ],
    []
  );

  const addMember = (newMember) => {
    const updatedMember = {
      ...newMember,
      id: data.length + 1,
    };
    setData([...data, updatedMember]);
  };

  const deleteMember = (id) => {
    setData(prevData => {
      const newData = prevData.filter(member => member.id !== id);
      return newData.map((member, index) => ({ ...member, id: index + 1 }));
    });
  };

  return (
    <div className={styles.container}>
      <h1>멤버 관리</h1>
      <p>
        아바타, 직업군, SNS 링크 등은 클릭하여 수정 가능합니다.<br />
        ID(자동생성), 닉네임은 데이터 혼동을 방지하기 위하여 처음 생성 이후 직접
        데이터베이스를 수정하는 방식 외에는 수정이 불가능합니다.
      </p>
      <button onClick={() => setIsModalOpen(true)}> + 멤버 추가 </button>
      <MemberTable columns={columns} data={data} />
      <MemberAddModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddMember={addMember}
      />
    </div>
  );
}
