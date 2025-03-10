'use client'

import styles from '@/styles/MemberManagement.module.css';
import MemberTable from '@/components/MemberTable';
import MemberAddModal from '@/components/MemberAddModal';
import { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import {CellProps} from 'react-table';


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

export default function MemberManagement() {
  const [data, setData] = useState<Member[]>([]);


  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = useMemo(
    () => [
      { Header: 'ID', accessor: 'user_id' },
      {
        Header: 'Avatar',
        accessor: 'avatar_image_url',
        Cell: ({ value }: { value?: string }) => (
          value && value !== "default avatar" ? <img src={value} alt="Avatar" /> : <img src="/admin_icon/alt_img.svg" alt="Avatar" />
        )        
      },
      { Header: 'Nickname', accessor: 'nickname' },
      {
        Header: 'Role',
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

      /*
      {data.map((artist, index) => (
              <ArtistBox key={index} artist={artist} />
            ))}
            */
      { Header: 'Twitter', accessor: 'twitter_url' },
      { Header: 'Instagram', accessor: 'instar_url' },
      { Header: 'Works', accessor: 'works_count' },
      {
        Header: 'Delete',
        accessor: 'delete',
        Cell: ({ cell }: CellProps<{ user_id: number }>) => (
          <button
            className={styles.delete_button}
            onClick={() => deleteMember(cell.row.original.user_id)}
          >
            삭제
          </button>
        ),
      },
    ],
    []
  );

  const deleteMember = async (userId:number) => {
    try {
      await axios.patch(`http://localhost:4000/api/admin/user_modify/${userId}`, { status: 'inactive' });
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await axios.get<Member[]>("http://localhost:4000/api/admin/users");
        // const filteredData = response.data.filter(member => member.status === "active");
        // setData(filteredData);
        const dummyData: Member[] = [
          {
            status: "active",
            user_id: 1,
            avatar_image_url: "/admin_icon/alt_img.svg",
            nickname: "DISCUZZ",
            roles: [1, 3], // 일러스트레이터 & 애니메이터
            twitter_url: "https://twitter.com/user1",
            instar_url: "https://instagram.com/user1",
            works_count: 3,
          },
          {
            status: "active",
            user_id: 2,
            avatar_image_url: "/admin_icon/alt_img.svg",
            nickname: "GUEST",
            roles: [2], // 작곡가
            twitter_url: "NONE",
            instar_url: "NONE",
            works_count: 0,
          },
        ];
  
        setData(dummyData); // 임시 데이터 적용
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };    

    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <h1>멤버 관리</h1>
      <p>
        아바타, 직업군, SNS 링크 등은 클릭하여 수정 가능합니다.<br />
        ID(자동생성), 닉네임은 데이터 혼동을 방지하기 위하여 처음 생성 이후 직접
        데이터베이스를 수정하는 방식 외에는 수정이 불가능합니다.
      </p>
      <button className={styles.add_button} onClick={() => setIsModalOpen(true)}> + 멤버 추가 </button>
      <MemberTable columns={columns} data={data} />
      <MemberAddModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
