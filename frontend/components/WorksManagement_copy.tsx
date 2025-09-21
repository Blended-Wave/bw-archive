'use client'
import { useState, useEffect, useMemo } from 'react';
import styles from '@/styles/WorksManagement.module.css';
import WorksTable from '@/components/WorksTable';
import WorkModal from '@/components/WorkModal';
import { CellProps, Row } from 'react-table';
import api from '@/lib/axios';

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
  const [editingWorkId, setEditingWorkId] = useState<number | null>(null);

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
        main_artist: work.main_artist ? work.main_artist.nickname : '삭제된 아티스트',
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
  
  const handleHardDelete = async (workId: number) => {
    if (window.confirm('정말로 이 작업물을 영구적으로 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
      try {
        await api.delete(`/admin/hard_delete_work/${workId}`);
        fetchWorks(); // Re-fetch data to update the table
      } catch (error) {
        console.error('Error hard deleting work:', error);
        alert('작업물을 영구적으로 삭제하는 데 실패했습니다.');
      }
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
        Cell: ({ cell }: CellProps<{ id: number; status: string }>) => (
          <div className={styles.action_buttons}>
            {cell.row.original.status === 'inactive' ? (
              <>
                <button
                  className={styles.restore_button}
                  onClick={() => restoreWork(cell.row.original.id)}
                >
                  복구
                </button>
                <button
                  className={styles.hard_delete_button}
                  onClick={() => handleHardDelete(cell.row.original.id)}
                >
                  바로 삭제
                </button>
              </>
            ) : (
              <>
                <button 
                  className={styles.edit_button}
                  onClick={() => handleEditClick(cell.row.original.id)}
                >
                  수정
                </button>
                <button
                  className={styles.delete_button}
                  onClick={() => deleteWork(cell.row.original.id)}
                >
                  삭제
                </button>
              </>
            )}
          </div>
        ),
      },
    ],
    []
  );

  const handleModalSave = async (workData: any, files: { thumbnail?: File, workFile?: File }) => {
    const formData = new FormData();

    // Append files if they exist
    if (files.thumbnail) {
      formData.append('files', files.thumbnail, 'thumbnail');
    }
    if (files.workFile) {
      formData.append('files', files.workFile, 'workFile');
    }

    // Append work data as a JSON string
    formData.append('workInfo', JSON.stringify(workData));

    try {
      if (editingWorkId) {
        // Update logic
        await api.patch(`/admin/modify_works/${editingWorkId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('작업물이 성공적으로 수정되었습니다.');
      } else {
        // Add new logic
        await api.post('/admin/add_works', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('작업물이 성공적으로 추가되었습니다.');
      }
      
      setModalOpen(false);
      fetchWorks();
    } catch (error) {
      console.error('작업물 저장에 실패했습니다.', error);
      alert('작업물 저장에 실패했습니다.');
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

  const handleEditClick = (workId: number) => {
    setEditingWorkId(workId);
    setModalOpen(true);
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>작업물 관리</h1>
        <button onClick={() => { setEditingWorkId(null); setModalOpen(true); }}>
          + 작업물 추가
        </button>
      </div>
      <WorksTable columns={columns} data={data} getRowProps={(row: Row<Work>) => ({ className: row.original.status === 'inactive' ? styles.inactive_row : '' })} />
      <WorkModal 
        isOpen={isModalOpen} 
        onClose={() => { setModalOpen(false); setEditingWorkId(null); }}
        onSave={handleModalSave}
        workId={editingWorkId} 
      />
    </div>
  );
}