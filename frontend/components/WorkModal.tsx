'use client';

import styles from '@/styles/WorkModal.module.css';
import { useState, useEffect } from 'react';
import ArtistSearchModal from './ArtistSearchModal';

interface WorkData {
    artTitle: string;
    seriesName: string;
    credits: string;
    thumbnail: string;
    type: string;
    private_option: boolean;
    pinned_option: boolean;
    main_artist: string;
    datetime: string; // 이 부분은 서버에서 자동 생성될 수 있으므로, 클라이언트에서는 보내지 않을 수 있습니다.
    status: string; // status 속성 추가
}

interface WorkModalProps {
    onClose: () => void;
    onSave: (workData: any, files: { thumbnail?: File, workFile?: File }) => void;
}

export default function WorkModal({ onClose, onSave }: WorkModalProps) {
    const [workData, setWorkData] = useState({
        artTitle: '',
        seriesName: '',
        description: '',
        credits: '',
        type: 'video',
        private_option: false,
        pinned_option: false,
        main_artist: '',
        status: 'active',
        datetime: new Date().toISOString(), // Add current datetime
    });
    const [thumbnailFile, setThumbnailFile] = useState<File | undefined>();
    const [workFile, setWorkFile] = useState<File | undefined>();
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [workFilePreview, setWorkFilePreview] = useState<string | null>(null);
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            const file = files[0];
            if (name === 'thumbnail') {
                setThumbnailFile(file);
                const reader = new FileReader();
                reader.onloadend = () => setThumbnailPreview(reader.result as string);
                reader.readAsDataURL(file);
            } else if (name === 'workFile') {
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
        } else {
            setWorkFile(undefined);
            setWorkFilePreview(null);
        }
    };

    useEffect(() => {
        return () => {
            if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
            if (workFilePreview) URL.revokeObjectURL(workFilePreview);
        };
    }, [thumbnailPreview, workFilePreview]);

    const handleArtistSelect = (selectedArtists: { main: string, credits: string[] }) => {
        setWorkData(prev => ({
            ...prev,
            main_artist: selectedArtists.main,
            credits: selectedArtists.credits.join(', '),
        }));
    };
    
    const handleSave = () => {
        if (!workData.artTitle || !workData.main_artist) {
            alert('제목과 메인 아티스트는 필수 항목입니다.');
            return;
        }
        onSave(workData, { thumbnail: thumbnailFile, workFile: workFile });
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

    return (
        <div className={styles.modal_overlay} onClick={onClose}>
            <div className={styles.modal_container} onClick={(e) => e.stopPropagation()}>
                <h2 className={styles.modal_title}>작업물 업로드</h2>
                <div className={styles.content_wrapper}>
                    <div className={styles.left_column}>
                        <div className={styles.input_group_horizontal}>
                            <label>제목</label>
                            <input name="artTitle" value={workData.artTitle} onChange={handleChange} placeholder="작업물 제목입니다." />
                        </div>
                        <div className={styles.input_group_horizontal}>
                            <label>시리즈</label>
                            <input name="seriesName" value={workData.seriesName} onChange={handleChange} placeholder="시리즈 이름입니다." />
                        </div>
                        <div className={styles.input_group_horizontal}>
                            <label>날짜</label>
                            <input 
                                type="datetime-local" 
                                name="datetime" 
                                value={workData.datetime ? workData.datetime.slice(0, 16) : ''} 
                                onChange={handleChange} 
                            />
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
                                {workData.credits.split(',').filter(c => c.trim()).map(artist => (
                                    <span key={artist} className={styles.artist_tag}>{artist}</span>
                                ))}
                            </div>
                        </div>
                        <div className={styles.input_group_horizontal_top}>
                            <label>파일</label>
                            <div className={styles.file_upload_main_area}>
                                <div className={styles.file_upload_left}>
                                    <div className={styles.file_buttons}>
                                        <input type="file" name="workFile" onChange={handleFileChange} id="workFileInput" style={{ display: 'none' }} />
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
                                    {workFilePreview && <img src={workFilePreview} alt="Work file preview"/>}
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
                                {thumbnailPreview && <img src={thumbnailPreview} alt="Thumbnail preview" />}
                    </div>
                            <div className={styles.thumbnail_buttons}>
                                <input type="file" name="thumbnail" onChange={handleFileChange} accept="image/*" id="thumbnailInput" style={{ display: 'none' }}/>
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
                    <button className={styles.close_button} onClick={onClose}>
                        <img src="/admin_icon/close_icon.svg" alt="close" /> Close
                    </button>
                    <button className={styles.preview_button} onClick={handlePreview}>
                        <img src="/admin_icon/preview_icon.svg" alt="preview" /> Preview
                    </button>
                    <button onClick={handleSave} className={styles.publish_button}>
                        <img src="/admin_icon/publish_icon.svg" alt="publish" /> Publish
                    </button>
                </div>
            </div>
            {isArtistModalOpen && <ArtistSearchModal onClose={() => setIsArtistModalOpen(false)} onSelect={handleArtistSelect} />}
            </div>
    );
}