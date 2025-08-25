import styles from '@/styles/WorksManagement.module.css';
import WorksTable from '@/components/WorksTable';
import { useMemo, useState, useEffect } from 'react';
import api from '@/lib/axios'; // 수정된 부분
import WorkModal from '@/components/WorkModal'; // WorkModal 추가
import { Row } from 'react-table';

interface Work {
  id: number;
  thumbnail: string;
  type: string;
  artTitle: string;
  seriesName: string;
  credits: string;
  datetime: string;
  private_option: boolean;
  status: string;
  pinned_option: boolean;
  main_artist: string;
}

export default function WorksManagement() {
  const [data, setData] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false); // 모달 상태 추가

  useEffect(() => {
    fetchWorks();
  }, []);

  const fetchWorks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/all_works');
      
      const transformedData = response.data.works.map((work: any) => ({
        id: work.works_id,
        thumbnail: work.thumbnail_url, // thumb_url -> thumbnail_url로 수정
        type: work.type,
        artTitle: work.title,
        seriesName: work.series || 'N/A',
        credits: work.credits.map((c: any) => c.nickname).join(', ') || 'N/A', // 데이터가 없으면 'N/A' 표시
        datetime: new Date(work.created_at).toLocaleDateString(),
        private_option: work.private,
        status: work.status,
        pinned_option: work.pinned,
        main_artist: work.main_artist ? work.main_artist.nickname : 'N/A',
      }));

      setData(transformedData);
      setError(null);
    } catch (err) {
      setError('작업 목록을 불러오는 데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const columns = useMemo( 
    () => [ 
      { Header: 'ID', accessor: 'id' }, 
      {
        Header: '썸네일',
        accessor: 'thumbnail',
        Cell: ({ value }: { value: string }) => {
          // value가 유효한 URL인지 확인하고, 그렇지 않으면 기본 이미지 사용
          const imageUrl = value ? value : '/admin_icon/alt_img.svg';
          return <img src={imageUrl} alt="Thumbnail" style={{ width: 100, height: 100, objectFit: 'cover' }} />;
        },
      },
      { Header: '타입', accessor: 'type' },
      { Header: '제목', accessor: 'artTitle' },
      { Header: '시리즈', accessor: 'seriesName' },
      { Header: '메인 아티스트', accessor: 'main_artist' },
      { Header: '크레딧', accessor: 'credits' },
      { Header: '생성 날짜', accessor: 'datetime' },
      { Header: '비공개', accessor: 'private_option', Cell: ({ value }: { value: boolean }) => (value ? 'Yes' : 'No') },
      { Header: '고정', accessor: 'pinned_option', Cell: ({ value }: { value: boolean }) => (value ? 'Yes' : 'No') },
      {
        Header: '작업',
        Cell: ({ cell }: { cell: any }) => (
          cell.row.original.status === 'inactive' ? (
            <button
              onClick={() => restoreWork(cell.row.original.id)}
              className={styles.restore_button}
            >
              복구
            </button>
          ) : (
            <button
              onClick={() => deleteWork(cell.row.original.id)}
              className={styles.delete_button}
            >
              삭제
            </button>
          )
        ),
      },
    ],
    []
  );

  const handleAddWork = async (workData: Omit<Work, 'id'>, files: { thumbnail?: File, workFile?: File }) => {
    try {
      let thumbnailUrl = '';
      let fileUrl = '';

      // FormData를 사용하여 파일 업로드
      if (files.thumbnail) {
        const formData = new FormData();
        formData.append('thumbnail_url', files.thumbnail);
        const response = await api.post('/upload/files?type=thumbnail', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        thumbnailUrl = response.data.thumbnail_url;
      }
      
      if (files.workFile) {
        const formData = new FormData();
        formData.append('file_url', files.workFile);
        const response = await api.post('/upload/files?type=file', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        fileUrl = response.data.file_url;
      }

      const workDto = {
        title: workData.artTitle,
        series: workData.seriesName,
        thumb_url: thumbnailUrl,
        file_url: fileUrl,
        type: workData.type,
        private: workData.private_option,
        pinned: workData.pinned_option,
        main_artist: { id: parseInt(workData.main_artist, 10) }, // main_artist를 ID 객체로 변환
        credits: workData.credits.split(',').map(id => ({ id: parseInt(id.trim(), 10) })), // credits를 ID 배열로 변환
        description: '임시 설명', // DTO에 있지만 모달에 없는 필드
      };
  
      await api.post('/admin/add_works', workDto);
      fetchWorks(); // 목록 새로고침
      setModalOpen(false); // 모달 닫기
    } catch (err) {
      console.error('작업 추가 실패:', err);
      alert('작업 추가에 실패했습니다. 백엔드 로그를 확인해주세요.');
    }
  };

  const restoreWork = async (id: number) => {
    try {
      await api.patch(`/admin/cancle_delete_works/${id}`); // 수정된 부분
      fetchWorks(); // 목록 새로고침
    } catch (err) {
      console.error('작업 복구 실패:', err);
    }
  };

  const deleteWork = async (id: number) => {
    try {
      await api.patch(`/admin/delete_works/${id}`); // 수정된 부분
      fetchWorks(); // 목록 새로고침
    } catch (err) {
      console.error('작업 삭제 실패:', err);
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.container}>
      <h1>작업물 관리</h1>
      <p>
      - 작업물을 업로드, 수정, 삭제할 수 있습니다. 작업물을 클릭 시 수정 페이지로 이동하며 수정 페이지에서 작업물의 설명, 작업물 미리보기 등을 확인할 수 있습니다.<br/>
      - 삭제를 하게 되면 게시글이 비활성화되고, 비활성화된 데이터는 일주일 뒤 완전히 삭제됩니다. 복구 버튼을 눌러 복구할 수 있습니다.
      </p>
      <button onClick={() => setModalOpen(true)}> + 작업물 추가 </button>
      {isModalOpen && <WorkModal onClose={() => setModalOpen(false)} onSave={handleAddWork} />}
      <WorksTable columns={columns} data={data} getRowProps={(row: Row<Work>) => ({ className: row.original.status === 'inactive' ? styles.inactive_row : '' })} />
    </div>
  );
}