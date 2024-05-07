import styles from '@/styles/MemberManagement.module.css';
import MemberTable from '@/components/MemberTable';
import { useMemo, useState } from 'react';

export default function MemberManagement() {
  const [data, setData] = useState([
    {
      id: 1,
      Avatar: 'https://via.placeholder.com/150',
      Name: '테스트1',
      Role: 'developer',
      Twitter: 'https://twitter.com',
      Instagram: 'https://instagram.com',
      Works: 3,
    },
    {
      id: 2,
      Avatar: 'https://via.placeholder.com/100',
      Name: '테스트2',
      Role: 'aaaaaa',
      Twitter: 'https://twitter.com',
      Instagram: 'https://instagram.com',
      Works: 3,
    },
  ]);

  const columns = useMemo(
    () => [
      { Header: 'ID', accessor: 'id' },
      {
        Header: 'Avatar',
        accessor: 'Avatar',
        Cell: ({ value }) => (
          <img src={value} alt="Avatar" style={{ width: 142, height: 142 }} />
        ),
      },
      { Header: 'Name', accessor: 'Name' },
      { Header: 'Role', accessor: 'Role' },
      { Header: 'Twitter', accessor: 'Twitter' },
      { Header: 'Instagram', accessor: 'Instagram' },
      { Header: 'Works', accessor: 'Works' },
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

  const addMember = () => {
    const newMember = {
      id: data.length + 1,
      Avatar: 'https://via.placeholder.com/150',
      Name: '새 멤버',
      Role: 'new role',
      Twitter: '',
      Instagram: '',
      Works: 0,
    };
    setData([...data, newMember]);
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
      <button onClick={addMember}> + 멤버 추가 </button>
      <MemberTable columns={columns} data={data} />
    </div>
  );
}