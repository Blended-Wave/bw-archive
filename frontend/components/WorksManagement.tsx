'use client';
import { useState, useEffect, useMemo } from 'react';
import styles from '@/styles/WorksManagement.module.css';
import WorksTable from '@/components/WorksTable';
import WorkModal from '@/components/WorkModal';
import { CellProps, Row, Column } from 'react-table';
import api from '@/lib/axios';

// This interface should match the one in WorkModal.tsx
interface WorkData {
  title: string;
  series: string;
  description: string;
  main_artist: string;
  credits: string;
  type: 'image' | 'video';
  private_option: boolean;
  pinned_option: boolean;
  status: 'active' | 'inactive';
  datetime: string;
  thumbnail: any;
  [key: string]: any; 
}

interface Work {
  works_id: number; // Changed from id to match API response
  thumbnail_url: string; // Changed from thumb_url
  title: string;
  series: string; // Add series
  main_artist: { nickname: string; };
  credits: { nickname: string; }[]; // Add credits
  type: string;
  status: string; // Add status back
  created_at: string;
  private_option: boolean; // Add private_option
  pinned_option: boolean; // Add pinned_option
}

export default function WorksManagement() {
  const [data, setData] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingWorkId, setEditingWorkId] = useState<number | null>(null);

  const fetchWorks = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/all_works');
      console.log('API Response:', JSON.stringify(response.data, null, 2)); // Log the full API response
      // The actual array is inside response.data.result.works due to pagination object
      setData(response.data.result.works); 
    } catch (err) {
      console.error('Failed to fetch works:', err); // Log the error object
      setError('작업물을 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  const handleEditClick = (workId: number) => {
    setEditingWorkId(workId);
    setModalOpen(true);
  };
  
  const handleModalSave = async (
    workData: WorkData,
    files: { thumbnail?: File; workFile?: File },
  ) => {
    const formData = new FormData();

    // Append all fields from workData to formData
    Object.keys(workData).forEach(key => {
      const value = workData[key];
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      }
    });

    if (files.thumbnail) {
      formData.append('thumbnail', files.thumbnail);
    }
    if (files.workFile) {
      formData.append('workFile', files.workFile);
    }

    try {
      if (editingWorkId) {
        await api.patch(`/admin/works_modify/${editingWorkId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/admin/works_add', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      setModalOpen(false);
      fetchWorks(); // Refresh table
    } catch (error) {
      console.error('Failed to save work:', error);
      alert('작업물 저장에 실패했습니다.');
    }
  };


  const deleteWork = async (id: number) => {
    if (window.confirm('정말로 이 작업물을 삭제(비활성화)하시겠습니까?')) {
      try {
        await api.patch(`/admin/works_status/${id}`);
        fetchWorks();
      } catch (err) {
        alert('작업물 삭제에 실패했습니다.');
      }
    }
  };

  const restoreWork = async (id: number) => {
    if (window.confirm('이 작업물을 복구하시겠습니까?')) {
      try {
        await api.patch(`/admin/works_status/${id}`);
        fetchWorks();
      } catch (err) {
        alert('작업물 복구에 실패했습니다.');
      }
    }
  };

    const handleHardDelete = async (workId: number) => {
     if (window.confirm('정말로 이 작업물을 영구적으로 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
       try {
         await api.delete(`/admin/hard_delete_work/${workId}`);
         fetchWorks(); 
       } catch (error) {
         console.error('Error hard deleting work:', error);
         alert('작업물을 영구적으로 삭제하는 데 실패했습니다.');
       }
     }
   };

  const columns = useMemo((): Column<Work>[] => [ 
        { Header: 'ID', accessor: 'works_id' },
        {
            Header: '썸네일',
            accessor: 'thumbnail_url', // Changed from thumb_url
            Cell: ({ value }: { value: string }) => (
                <img
                    src={value || '/admin_icon/alt_img.svg'}
                    alt="Thumbnail"
                    style={{ width: 100, height: 100, objectFit: 'cover' }}
                />
            ),
        },
        { Header: '제목', accessor: 'title' },
        { Header: '시리즈', accessor: 'series' },
        {
            Header: '메인 아티스트',
            accessor: 'main_artist',
            Cell: ({ value }: { value: { nickname: string } }) =>
                value?.nickname || '삭제된 아티스트',
        },
        {
            Header: '크레딧',
            accessor: 'credits',
            Cell: ({ value }: { value: { nickname: string }[] }) =>
                value?.map((c) => c.nickname).join(', ') || 'N/A',
        },
        { Header: '타입', accessor: 'type' },
        {
            Header: '등록일',
            accessor: 'created_at',
            Cell: ({ value }: { value: string }) =>
                new Date(value).toLocaleDateString(),
        },
        {
            Header: '비공개',
            accessor: 'private_option',
            Cell: ({ value }: { value: boolean }) => (value ? 'Yes' : 'No'),
        },
        {
            Header: '고정',
            accessor: 'pinned_option',
            Cell: ({ value }: { value: boolean }) => (value ? 'Yes' : 'No'),
        },
        {
            Header: '작업',
            accessor: 'works_id' as any, // Add accessor for actions column
            Cell: ({ cell }: CellProps<Work>) => (
                <div className={styles.action_buttons}>
                    {cell.row.original.status === 'inactive' ? (
                        <>
                            <button className={styles.restore_button} onClick={() => restoreWork(cell.row.original.works_id)}>복구</button>
                            <button className={styles.hard_delete_button} onClick={() => handleHardDelete(cell.row.original.works_id)}>바로 삭제</button>
                        </>
                    ) : (
                        <>
                            <button className={styles.edit_button} onClick={() => handleEditClick(cell.row.original.works_id)}>수정</button>
                            <button className={styles.delete_button} onClick={() => deleteWork(cell.row.original.works_id)}>삭제</button>
                        </>
                    )}
                </div>
            )
        }
    ], 
    [] 
  );
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>작업물 관리</h1>
        <button onClick={() => { setEditingWorkId(null); setModalOpen(true); }}>
          + 작업물 추가
        </button>
      </div>
      <WorksTable columns={columns as any} data={data} getRowProps={(row: Row<Work>) => ({ className: row.original.status === 'inactive' ? styles.inactive_row : '' })} />
      <WorkModal 
        isOpen={isModalOpen} 
        onClose={() => { setModalOpen(false); setEditingWorkId(null); }} 
        onSave={handleModalSave} 
        workId={editingWorkId} 
      />
    </div>
  );
}