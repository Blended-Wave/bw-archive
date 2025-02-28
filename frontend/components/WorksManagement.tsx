import styles from '@/styles/WorksManagement.module.css';
import WorksTable from '@/components/WorksTable';
import { useMemo, useState } from 'react';

export default function WorksManagement() {
  const [data, setData] = useState([
    {
      id: 1,
      avatar: 'https://via.placeholder.com/150',
      type: 'video',
      arttitle: 'Lorem Ipsum',
      seriesname: 'Lorem Ipsum',
      credit: 'DISUCZZ',
      datetime: new Date().toLocaleDateString(),
    },
  ]);

  /**  React Table을 통해 컬럼(column)을 정의하는 코드
    *  useMemo를 통해 memoizattion (React Hook) 불필요한 렌더링 방지하고 성능 최적화, useMemo를 통해 columns 배열을 한번만 생성(데이터가 바뀌지 않는한 그대로 유지) */
  const columns = useMemo( 
    () => [ // 각 객체들은 테이블의ㅣ 컬럼을 정의
      { Header: 'ID', accessor: 'id' }, // Header: 테이블 헤더에 표시될 텍스트
      {
        Header: 'avatar',
        accessor: 'avatar', // accessor: 데이터 객체에서 가져올 속성 이름(ex. id, type)
        Cell: ({ value }) => ( // Cell: 이미지같은 데이터 렌더링 가능
          <img src={value} alt="avatar" style={{ width: 142, height: 142 }} />
        ),
      },
      { Header: 'type', accessor: 'type' },
      { Header: 'arttitle', accessor: 'arttitle' },
      { Header: 'seriesname', accessor: 'seriesname' },
      { Header: 'credit', accessor: 'credit' },
      { Header: 'datetime', accessor: 'datetime' },
      {
        Header: 'Delete',
        accessor: 'delete',
        Cell: ({ cell }) => (
          <button
            onClick={() => deleteMember(cell.row.original.id)} // 해당 행의 id 값을 가져와서 삭제할 수 있도록 설정
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
      avatar: 'https://via.placeholder.com/150',
      type: 'vedio',
      arttitle: 'Lorem Ipsum',
      seriesname: 'Lorem Ipsum',
      credit: 'DISUCZZ',
      datetime: new Date().getDate(),
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
      <h1>작업물 관리</h1>
      <p>
      작업물을 업로드, 수정, 삭제할 수 있습니다. 작업물을 클릭 시 수정 페이지로 이동하며 수정 페이지에서 작업물의 설명, 작업물 미리보기 등을 확인할 수 있습니다.<br/>
      시리즈 이름은 추후 업데이트를 통한 기능 추가로 인해 입력 방식이 변경될 수 있습니다..
      </p>
      <button onClick={addMember}> + 작업물 추가 </button>
      <WorksTable columns={columns} data={data} />
    </div>
  );
}