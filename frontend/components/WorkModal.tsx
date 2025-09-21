'use client';

import styles from '@/styles/WorkModal.module.css';
import { useState, useEffect } from 'react';
import ArtistSearchModal from './ArtistSearchModal';
import api from '@/lib/axios';

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

interface WorkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (
        workData: WorkData,
        files: { thumbnail?: File; workFile?: File },
    ) => Promise<void>; // Changed return type to Promise<void>
    workId?: number | null;
}

interface FileInfo {
    name: string;
    type: string;
    size: number;
    dimensions: string;
}

const WorkModal = ({ isOpen, onClose, onSave, workId }: WorkModalProps) => {
    const isEditMode = workId !== null;
    const [workData, setWorkData] = useState<WorkData>({
        title: '',
        series: '',
        description: '',
        main_artist: '',
        credits: '',
        type: 'video',
        private_option: false,
        pinned_option: false,
        status: 'active',
        datetime: '',
        thumbnail: null,
    });
    const [thumbnailFile, setThumbnailFile] = useState<File | undefined>();
    const [workFile, setWorkFile] = useState<File | undefined>();
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [thumbnailInfo, setThumbnailInfo] = useState<FileInfo | null>(null);
    const [workFilePreview, setWorkFilePreview] = useState<string | null>(null);
    const [workFileInfo, setWorkFileInfo] = useState<FileInfo | null>(null);
    const [isArtistModalOpen, setIsArtistModalOpen] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setWorkData(prev => ({ ...prev, [name]: checked }));
        } else if (type === 'datetime-local') {
            // Convert datetime-local to ISO string
            const date = new Date(value);
            setWorkData(prev => ({ ...prev, [name]: date.toISOString() }));
        } else {
            setWorkData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, fileType: 'thumbnail' | 'workFile') => {
        const { files } = event.target;
        if (files && files[0]) {
            const file = files[0];
            if (fileType === 'thumbnail') {
                setThumbnailFile(file);
                const reader = new FileReader();
                reader.onloadend = () => setThumbnailPreview(reader.result as string);
                reader.readAsDataURL(file);
            } else if (fileType === 'workFile') {
                setWorkFile(file);
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onloadend = () => setWorkFilePreview(reader.result as string);
                    reader.readAsDataURL(file);
                } else {
                    setWorkFilePreview(null);
                }
            }
        }
    };

    const handleDeleteFile = (fileType: 'thumbnail' | 'workFile') => {
        if (fileType === 'thumbnail') {
            setThumbnailFile(undefined);
            setThumbnailPreview(null);
            setThumbnailInfo(null);
        } else {
            setWorkFile(undefined);
            setWorkFilePreview(null);
            setWorkFileInfo(null);
        }
    };

    const getFileInfoFromUrl = (url: string, type: string): Promise<FileInfo> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                resolve({
                    name: url.split('/').pop() || 'file',
                    type: type,
                    size: 0, // Size cannot be determined from URL alone
                    dimensions: `${img.width}x${img.height}`,
                });
            };
            img.onerror = () => { // Handle cases where the URL is not an image (e.g., video)
                resolve({ name: url.split('/').pop() || 'file', type, size: 0, dimensions: 'N/A' });
            };
            img.src = url;
        });
    };

    useEffect(() => {
        if (isOpen && isEditMode && workId) {
            const fetchWorkForEdit = async () => {
                try {
                    const response = await api.get(`/admin/works_modify/${workId}`);
                    if (response.data && response.data.result) {
                        const fetchedData = response.data.result;

                        // Transform artist/credits objects into strings for input fields
                        const transformedData = {
                            ...fetchedData,
                            main_artist: fetchedData.main_artist?.nickname || '',
                            credits: Array.isArray(fetchedData.credits)
                                ? fetchedData.credits.map((c: any) => c.nickname).join(', ')
                                : '',
                            thumbnail: fetchedData.thumbnail_url || null,
                        };

                        setWorkData(transformedData);

                        if (fetchedData.thumbnail_url) {
                            setThumbnailPreview(fetchedData.thumbnail_url);
                        }
                        if (fetchedData.file_url) {
                            setWorkFilePreview(fetchedData.file_url);
                        }
                    }
                } catch (error) {
                    console.error('Error fetching work for edit:', error);
                }
            };
            fetchWorkForEdit();
        } else {
            // Reset form for 'add' mode
            setWorkData({
                title: '',
                series: '',
                description: '',
                main_artist: '',
                credits: '',
                type: 'video',
                private_option: false,
                pinned_option: false,
                status: 'active',
                datetime: '',
                thumbnail: null,
            });
            setThumbnailPreview(null);
            setWorkFilePreview(null);
            setThumbnailInfo(null);
            setWorkFileInfo(null);
        }
    }, [isOpen, isEditMode, workId]);

    const handleArtistSelect = (selectedArtists: { main: string, credits: string[] }) => {
        setWorkData(prev => ({
            ...prev,
            main_artist: selectedArtists.main,
            credits: selectedArtists.credits.join(', '),
        }));
    };
    
    const handleSave = () => {
        if (!workData.main_artist?.trim()) {
            alert('메인 아티스트를 선택/입력해 주세요.');
            return;
          }
        const files = { thumbnail: thumbnailFile, workFile: workFile };
        onSave(workData, files);
    };

    const handlePreview = () => {
        const previewData = {
            ...workData,
            thumbnailPreview,
            datetime: workData.datetime, // Include datetime in preview data
        };
        sessionStorage.setItem('workPreviewData', JSON.stringify(previewData));
        window.open('/work/preview', '_blank');
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modal_overlay} onClick={onClose}>
            <div className={styles.modal_container} onClick={(e) => e.stopPropagation()}>
                <h2 className={styles.modal_title}>
                    {isEditMode ? '작업물 수정' : '작업물 추가'}
                </h2>
                <div className={styles.content_wrapper}>
                    <div className={styles.left_column}>
                        <div className={styles.input_group_horizontal}>
                            <label>제목</label>
                            <input name="title" value={workData.title} onChange={handleChange} placeholder="작업물 제목입니다." />
                        </div>
                        <div className={styles.input_group_horizontal}>
                            <label>시리즈</label>
                            <input name="series" value={workData.series} onChange={handleChange} placeholder="시리즈 이름입니다." />
                        </div>
                        <div className={styles.input_group_horizontal_top}>
                            <label>설명</label>
                            <textarea name="description" value={workData.description} onChange={handleChange} placeholder="작품에 대한 설명입니다." />
                        </div>
                        <div className={styles.input_group_horizontal}>
                            <label>아티스트</label>
                            <div className={styles.artist_selector}>
                                <button onClick={() => setIsArtistModalOpen(true)}>검색</button>
                                {workData.main_artist && <span className={`${styles.artist_tag} ${styles.main_artist_tag}`}>{workData.main_artist}</span>}
                                {typeof workData.credits === 'string' && workData.credits.split(',').filter(c => c.trim()).map(artist => (
                                    <span key={artist} className={styles.artist_tag}>{artist}</span>
                                ))}
                            </div>
                        </div>
                        <div className={styles.input_group_horizontal_top}>
                            <label>파일</label>
                            <div className={styles.file_upload_main_area}>
                                <div className={styles.file_upload_left}>
                                    <div className={styles.file_buttons}>
                                        <input type="file" name="workFile" onChange={(e) => handleFileChange(e, 'workFile')} id="workFileInput" style={{ display: 'none' }} />
                                        <button onClick={() => document.getElementById('workFileInput')?.click()}>
                                            <img src="/admin_icon/upload-icon.svg" alt="upload" /> Upload
                                        </button>
                                        <button onClick={() => handleDeleteFile('workFile')}>
                                            <img src="/admin_icon/delete-icon.svg" alt="delete" /> Delete
                                        </button>
                                    </div>
                                    <span className={styles.file_size_limit}>*최대 00mb</span>
                                    {workFile && (
                                        <div className={styles.file_info_text}>
                                            <p>파일 타입: {workFile.type}</p>
                                            <p>파일 크기: {(workFile.size / 1024 / 1024).toFixed(2)}MB</p>
                                        </div>
                                    )}
                                </div>
                                <div className={styles.file_upload_right_preview}>
                                    {workFilePreview && (
                                        <>
                                            <img src={workFilePreview} alt="Work file preview"/>
                                            {workFileInfo && (
                                                <div className={styles.file_info}>
                                                    <p>{workFileInfo.name}</p>
                                                    <p>{workFileInfo.dimensions}</p>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                </div>
                    </div>
                    <div className={styles.right_column}>
                        <div className={styles.checkbox_group}>
                            <label><input type="checkbox" name="pinned_option" checked={workData.pinned_option} onChange={handleChange} /> WORK 페이지 상단 고정</label>
                            <label><input type="checkbox" name="private_option" checked={workData.private_option} onChange={handleChange} /> 비공개</label>
                        </div>
                        <div className={styles.thumbnail_group}>
                            <p className={styles.thumbnail_title}>썸네일(미리보기)</p>
                            <div className={styles.thumbnail_box}>
                                {thumbnailPreview ? (
                                    <>
                                        <img src={thumbnailPreview} alt="썸네일 미리보기" className={styles.preview_image} />
                                        {thumbnailInfo && (
                                            <div className={styles.file_info}>
                                                <p>{thumbnailInfo.name}</p>
                                                <p>{thumbnailInfo.dimensions}</p>
                                            </div>
                                        )}
                                    </>
                                ) : <p>썸네일 없음</p>}
                    </div>
                            <div className={styles.thumbnail_buttons}>
                                <input type="file" name="thumbnail" onChange={(e) => handleFileChange(e, 'thumbnail')} accept="image/*" id="thumbnailInput" style={{ display: 'none' }}/>
                                <button onClick={() => document.getElementById('thumbnailInput')?.click()}>
                                    <img src="/admin_icon/upload-icon.svg" alt="upload" /> Upload
                                </button>
                                <span className={styles.file_size_limit}>*최대 1MB</span>
                    </div>
                            <p className={styles.thumbnail_help_text}>
                                상단의 미리보기는 250x250px 기준으로 제작되었습니다.<br/>
                                썸네일을 맞추지 않아도 업로드는 가능하지만 임의로 잘리거나 비율이 깨진 채 업로드 되므로, 가로 세로 1:1 비율은 유지하는 것을 권장합니다.<br/>
                                (권장하는 크기는 600x600~800x800px 입니다.)
                        </p>
                    </div>
                    </div>
                </div>
                <div className={styles.bottom_button_group}>
                    <button type="button" className={`${styles.btn} ${styles.btn_gray}`} onClick={onClose}>
                        <img src="/admin_icon/close_icon.svg" alt=""/> Close
                    </button>
                    <button type="button" className={`${styles.btn} ${styles.btn_gray}`} onClick={handlePreview}>
                        <img src="/admin_icon/preview_icon.svg" alt=""/> Preview
                    </button>
                    <button type="button" className={`${styles.btn} ${styles.btn_blue}`} onClick={handleSave}>
                        <img src="/admin_icon/publish_icon.svg" alt=""/> {isEditMode ? 'Update' : 'Publish'}
                    </button>
                </div>
            </div>
            {isArtistModalOpen && <ArtistSearchModal onClose={() => setIsArtistModalOpen(false)} onSelect={handleArtistSelect} />}
            </div>
    );
}

export default WorkModal;