import { useEffect, useRef, useState } from "react";
import styles from "../../styles/Member.module.css";
import Link from "next/link";

export default function Member() {
  const modalBackground = useRef();
  const [profilemodalOpen, setProfilemodalOpen] = useState(false);
  const [addmembermodalOpen, setAddmembermodalOpen] = useState(false);
  const [twittermodalOpen, setTwittermodalOpen] = useState(false);
  const [instargrammodalOpen, setInstargrammodalOpen] = useState(false);
  const [rolemodalOpen, setRolemodalOpen] = useState(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    mounted && (
      <div className={styles.background}>
        <div className={styles.sidebar}>
          <div className={styles.title}>
            <svg
              width="23"
              height="25"
              viewBox="0 0 23 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                id="Vector"
                d="M21.175 19.925C21.2 19.7375 21.2125 19.5625 21.2125 19.375C21.2125 19.1875 21.2 19 21.175 18.8125L22.3875 17.9C22.5 17.8125 22.5375 17.6625 22.4625 17.5375L21.3125 15.5875C21.25 15.4625 21.075 15.4125 20.95 15.4625L19.5125 16.025C19.2125 15.8125 18.9 15.625 18.5375 15.475L18.325 13.9875C18.3 13.85 18.175 13.75 18.0375 13.75H15.725C15.575 13.75 15.45 13.85 15.425 13.9875L15.2125 15.475C14.85 15.625 14.5375 15.8125 14.2375 16.025L12.8 15.4625C12.675 15.4125 12.5 15.4625 12.45 15.5875L11.2875 17.5375C11.2125 17.6625 11.25 17.8125 11.3625 17.9L12.575 18.8125C12.5625 19 12.5375 19.1875 12.5375 19.375C12.5375 19.5625 12.5625 19.7375 12.575 19.925L11.3625 20.85C11.25 20.9375 11.2125 21.0875 11.2875 21.2125L12.45 23.1625C12.5 23.2875 12.675 23.325 12.8 23.2875L14.2375 22.7125C14.5375 22.9375 14.85 23.125 15.2125 23.275L15.425 24.7625C15.45 24.9 15.575 25 15.725 25H18.0375C18.175 25 18.3 24.9 18.325 24.7625L18.5375 23.275C18.9 23.125 19.2125 22.9375 19.5125 22.7125L20.95 23.2875C21.075 23.325 21.25 23.2875 21.3125 23.1625L22.4625 21.2125C22.5375 21.0875 22.5 20.9375 22.3875 20.85L21.175 19.925ZM16.875 21.25C15.8375 21.25 15 20.4125 15 19.375C15 18.3375 15.8375 17.5 16.875 17.5C17.9125 17.5 18.75 18.3375 18.75 19.375C18.75 20.4125 17.9125 21.25 16.875 21.25ZM7.5 0C9.75 0.75 11.25 2.875 11.25 5.25C11.25 7.75 9.75 9.875 7.5 10.625V24.375C7.5 24.75 7.25 25 6.875 25H4.375C4 25 3.75 24.75 3.75 24.25V10.5C1.5 9.75 0 7.625 0 5.25C0 2.875 1.5 0.75 3.75 0V4.625H7.5V0Z"
                fill="white"
              />
            </svg>
            <p>BW Admin Panel</p>
          </div>
          <Link className={styles.manage_active} href="/admin">
            <svg
              width="4"
              height="30"
              viewBox="0 0 4 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                id="Vector 1"
                d="M2 0V30"
                stroke="#5C4B4B"
                stroke-width="4"
              />
            </svg>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                id="Vector"
                d="M8 0C9.06087 0 10.0783 0.421427 10.8284 1.17157C11.5786 1.92172 12 2.93913 12 4C12 5.06087 11.5786 6.07828 10.8284 6.82843C10.0783 7.57857 9.06087 8 8 8C6.93913 8 5.92172 7.57857 5.17157 6.82843C4.42143 6.07828 4 5.06087 4 4C4 2.93913 4.42143 1.92172 5.17157 1.17157C5.92172 0.421427 6.93913 0 8 0ZM8 10C12.42 10 16 11.79 16 14V16H0V14C0 11.79 3.58 10 8 10Z"
                fill="white"
              />
            </svg>
            <p>맴버 관리</p>
          </Link>
          <Link className={styles.manage} href="/admin/work">
            <svg
              width="21"
              height="21"
              viewBox="0 0 21 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                id="Vector"
                d="M7 11V3C7 1.9 7.9 1 9 1H18C19.1 1 20 1.9 20 3V9H16.57L15.29 7.26C15.23 7.17 15.11 7.17 15.05 7.26L13.06 10C13 10.06 12.88 10.07 12.82 10L11.39 8.25C11.33 8.18 11.22 8.18 11.16 8.25L9.05 10.91C8.97 11 9.04 11.15 9.16 11.15H15.5V13H9C7.89 13 7 12.11 7 11ZM4 20V19H2V20H0V0H2V1H4V0H6.39C5.54 0.74 5 1.8 5 3V11C5 13.21 6.79 15 9 15H13.7C12.67 15.83 12 17.08 12 18.5C12 19.03 12.11 19.53 12.28 20H4ZM2 5H4V3H2V5ZM2 9H4V7H2V9ZM2 13H4V11H2V13ZM4 17V15H2V17H4ZM21 11V13H19V18.5C19 19.88 17.88 21 16.5 21C15.12 21 14 19.88 14 18.5C14 17.12 15.12 16 16.5 16C16.86 16 17.19 16.07 17.5 16.21V11H21Z"
                fill="white"
              />
            </svg>
            <p>작업물 관리</p>
          </Link>
        </div>
        <div className={styles.content}>
          <p className={styles.content_info}>맴버 관리</p>
          <p className={styles.content_info}>
            아바타, 직업군, SNS 링크 등은 클릭하여 수정 가능합니다.
            <br /> ID(자동생성), 닉네임은 데이터 혼동을 방지하기 위하여 처음
            생성 이후 직접 데이터베이스를 수정하는 방식 외에는 수정이
            불가능합니다.
          </p>
          <button
            className={styles.member_plus}
            onClick={() => setAddmembermodalOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
            >
              <path
                d="M12 6.85714H6.85714V12H5.14286V6.85714H0V5.14286H5.14286V0H6.85714V5.14286H12V6.85714Z"
                fill="white"
              />
            </svg>
            <p>맴버 추가</p>
          </button>
          <table className={styles.data}>
            <tr>
              <th>ID</th>
              <th>Avatar</th>
              <th>Name</th>
              <th>Role</th>
              <th>Twitter</th>
              <th>Instargram</th>
              <th>Works</th>
              <th>Delete</th>
            </tr>
            <tr>
              <td>1</td>
              <td>
                <svg
                  onClick={() => setProfilemodalOpen(true)}
                  xmlns="http://www.w3.org/2000/svg"
                  width="142"
                  height="142"
                  viewBox="0 0 142 142"
                  fill="none"
                >
                  <g clip-path="url(#clip0_106_4)">
                    <rect width="148" height="148" fill="#D9D9D9" />
                    <path
                      d="M34 89C34 77.9543 42.9543 69 54 69H88C99.0457 69 108 77.9543 108 89V123H34V89Z"
                      fill="white"
                    />
                    <circle cx="71" cy="40" r="20" fill="white" />
                  </g>
                  <defs>
                    <clipPath id="clip0_106_4">
                      <rect width="142" height="142" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </td>
              <td>DISCUZZ</td>
              <td onClick={() => setRolemodalOpen(true)}>
                <p className={styles.illustrator}>일러스트레이터</p>
                <p className={styles.animator}>애니메이터</p>
                <p className={styles.composer}>작곡가</p>
                <p className={styles.writer}>작가</p>
              </td>
              <td onClick={() => setTwittermodalOpen(true)}>
                https://twitter.com/?lang=ko
              </td>
              <td onClick={() => setInstargrammodalOpen(true)}>
                https://www.instagram.com/
              </td>
              <td>7</td>
              <td>
                <button className={styles.delete}>삭제</button>
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>
                <svg
                  onClick={() => setProfilemodalOpen(true)}
                  xmlns="http://www.w3.org/2000/svg"
                  width="142"
                  height="142"
                  viewBox="0 0 142 142"
                  fill="none"
                >
                  <g clip-path="url(#clip0_106_4)">
                    <rect width="148" height="148" fill="#D9D9D9" />
                    <path
                      d="M34 89C34 77.9543 42.9543 69 54 69H88C99.0457 69 108 77.9543 108 89V123H34V89Z"
                      fill="white"
                    />
                    <circle cx="71" cy="40" r="20" fill="white" />
                  </g>
                  <defs>
                    <clipPath id="clip0_106_4">
                      <rect width="142" height="142" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </td>
              <td>GUEST</td>
              <td onClick={() => setRolemodalOpen(true)}>
                <p className={styles.illustrator}>일러스트레이터</p>
              </td>
              <td onClick={() => setTwittermodalOpen(true)}>NONE</td>
              <td onClick={() => setInstargrammodalOpen(true)}>NONE</td>
              <td>0</td>
              <td>
                <button className={styles.delete}>삭제</button>
              </td>
            </tr>
          </table>
        </div>
        {addmembermodalOpen && (
          <div
            className={styles.modal_container}
            ref={modalBackground}
            onClick={(e) => {
              if (e.target === modalBackground.current) {
                setAddmembermodalOpen(false);
              }
            }}
          >
            <div className={styles.addmembermodal_content}>
              <p>맴버 등록하기</p>
              <p>
                멤버의 이름을 입력하여 멤버를 추가할 수 있습니다.
                <br />
                (최대 16글자, 한글/영문자만 사용 가능합니다){" "}
              </p>
              <input type="text"></input>
              <div className={styles.modal_button}>
                <button
                  className={styles.modal_close}
                  onClick={() => setAddmembermodalOpen(false)}
                >
                  close
                </button>
                <button className={styles.modal_save}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M4.16667 2.5C3.24167 2.5 2.5 3.25 2.5 4.16667V15.8333C2.5 16.75 3.24167 17.5 4.16667 17.5H10.675C10.375 16.9833 10.1667 16.4167 10.0667 15.8333H4.16667V4.16667H13.475L15.8333 6.525V10.0667C16.4167 10.1667 16.9833 10.375 17.5 10.675V5.83333L14.1667 2.5H4.16667ZM5 5V8.33333H12.5V5H5ZM10 10C8.61667 10 7.5 11.1167 7.5 12.5C7.5 13.8833 8.61667 15 10 15C10 13.425 10.7417 11.95 11.9917 11.0083C11.5417 10.4167 10.8333 10 10 10ZM14.1667 11.6667V14.1667H11.6667V15.8333H14.1667V18.3333H15.8333V15.8333H18.3333V14.1667H15.8333V11.6667H14.1667Z"
                      fill="#0075FF"
                    />
                  </svg>
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
        {profilemodalOpen && (
          <div
            className={styles.modal_container}
            ref={modalBackground}
            onClick={(e) => {
              if (e.target === modalBackground.current) {
                setProfilemodalOpen(false);
              }
            }}
          >
            <div className={styles.profilemodal_content}>
              <img className={styles.profile_img}></img>
              <div className={styles.profilemodal_info}>
                <p>프로필 사진 추가</p>
                <p>
                  추가 버튼을 눌러 프로필을 추가할 수 있습니다.
                  <br /> 삭제 버튼을 통해 기존 프로필을 제거하고 기본 이미지로
                  설정할 수도 있습니다.
                </p>
                <div className={styles.profilemodal_button}>
                  <button className={styles.profilemodal_upload}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M9 10V16H15V10H19L12 3L5 10H9ZM12 5.8L14.2 8H13V14H11V8H9.8L12 5.8ZM19 18H5V20H19V18Z"
                        fill="#44B17D"
                      />
                    </svg>
                    Upload
                  </button>
                  <button className={styles.profilemodal_delete}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M5 19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H15C15.5304 21 16.0391 20.7893 16.4142 20.4142C16.7893 20.0391 17 19.5304 17 19V7H5V19ZM7 9H15V19H7V9ZM14.5 4L13.5 3H8.5L7.5 4H4V6H18V4H14.5Z"
                        fill="#D04141"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
                <div className={styles.modal_button}>
                  <button
                    className={styles.modal_close}
                    onClick={() => setProfilemodalOpen(false)}
                  >
                    close
                  </button>
                  <button className={styles.modal_save}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <path
                        d="M4.16667 2.5C3.24167 2.5 2.5 3.25 2.5 4.16667V15.8333C2.5 16.75 3.24167 17.5 4.16667 17.5H10.675C10.375 16.9833 10.1667 16.4167 10.0667 15.8333H4.16667V4.16667H13.475L15.8333 6.525V10.0667C16.4167 10.1667 16.9833 10.375 17.5 10.675V5.83333L14.1667 2.5H4.16667ZM5 5V8.33333H12.5V5H5ZM10 10C8.61667 10 7.5 11.1167 7.5 12.5C7.5 13.8833 8.61667 15 10 15C10 13.425 10.7417 11.95 11.9917 11.0083C11.5417 10.4167 10.8333 10 10 10ZM14.1667 11.6667V14.1667H11.6667V15.8333H14.1667V18.3333H15.8333V15.8333H18.3333V14.1667H15.8333V11.6667H14.1667Z"
                        fill="#0075FF"
                      />
                    </svg>
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {twittermodalOpen && (
          <div
            className={styles.modal_container}
            ref={modalBackground}
            onClick={(e) => {
              if (e.target === modalBackground.current) {
                setTwittermodalOpen(false);
              }
            }}
          >
            <div className={styles.twittermodal_content}>
              <p>트위터 링크</p>
              <input type="text"></input>
              <div className={styles.modal_button}>
                <button
                  className={styles.modal_close}
                  onClick={() => setTwittermodalOpen(false)}
                >
                  close
                </button>
                <button className={styles.modal_save}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M4.16667 2.5C3.24167 2.5 2.5 3.25 2.5 4.16667V15.8333C2.5 16.75 3.24167 17.5 4.16667 17.5H10.675C10.375 16.9833 10.1667 16.4167 10.0667 15.8333H4.16667V4.16667H13.475L15.8333 6.525V10.0667C16.4167 10.1667 16.9833 10.375 17.5 10.675V5.83333L14.1667 2.5H4.16667ZM5 5V8.33333H12.5V5H5ZM10 10C8.61667 10 7.5 11.1167 7.5 12.5C7.5 13.8833 8.61667 15 10 15C10 13.425 10.7417 11.95 11.9917 11.0083C11.5417 10.4167 10.8333 10 10 10ZM14.1667 11.6667V14.1667H11.6667V15.8333H14.1667V18.3333H15.8333V15.8333H18.3333V14.1667H15.8333V11.6667H14.1667Z"
                      fill="#0075FF"
                    />
                  </svg>
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
        {instargrammodalOpen && (
          <div
            className={styles.modal_container}
            ref={modalBackground}
            onClick={(e) => {
              if (e.target === modalBackground.current) {
                setInstargrammodalOpen(false);
              }
            }}
          >
            <div className={styles.twittermodal_content}>
              <p>인스타그램 링크</p>
              <input type="text"></input>
              <div className={styles.modal_button}>
                <button
                  className={styles.modal_close}
                  onClick={() => setInstargrammodalOpen(false)}
                >
                  close
                </button>
                <button className={styles.modal_save}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M4.16667 2.5C3.24167 2.5 2.5 3.25 2.5 4.16667V15.8333C2.5 16.75 3.24167 17.5 4.16667 17.5H10.675C10.375 16.9833 10.1667 16.4167 10.0667 15.8333H4.16667V4.16667H13.475L15.8333 6.525V10.0667C16.4167 10.1667 16.9833 10.375 17.5 10.675V5.83333L14.1667 2.5H4.16667ZM5 5V8.33333H12.5V5H5ZM10 10C8.61667 10 7.5 11.1167 7.5 12.5C7.5 13.8833 8.61667 15 10 15C10 13.425 10.7417 11.95 11.9917 11.0083C11.5417 10.4167 10.8333 10 10 10ZM14.1667 11.6667V14.1667H11.6667V15.8333H14.1667V18.3333H15.8333V15.8333H18.3333V14.1667H15.8333V11.6667H14.1667Z"
                      fill="#0075FF"
                    />
                  </svg>
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
        {rolemodalOpen && (
          <div
            className={styles.modal_container}
            ref={modalBackground}
            onClick={(e) => {
              if (e.target === modalBackground.current) {
                setRolemodalOpen(false);
              }
            }}
          >
            <div className={styles.rolemodal_content}>
              <p>직업군 선택</p>
              <div className={styles.rolemodal_checkbox}>
                <input type="checkbox" />
                일러스트레이터
                <input type="checkbox" />
                애니메이터
                <input type="checkbox" />
                작곡가
                <input type="checkbox" />
                작가
              </div>
              <div style={{ bottom: "10px" }} className={styles.modal_button}>
                <button
                  className={styles.modal_close}
                  onClick={() => setRolemodalOpen(false)}
                >
                  close
                </button>
                <button className={styles.modal_save}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M4.16667 2.5C3.24167 2.5 2.5 3.25 2.5 4.16667V15.8333C2.5 16.75 3.24167 17.5 4.16667 17.5H10.675C10.375 16.9833 10.1667 16.4167 10.0667 15.8333H4.16667V4.16667H13.475L15.8333 6.525V10.0667C16.4167 10.1667 16.9833 10.375 17.5 10.675V5.83333L14.1667 2.5H4.16667ZM5 5V8.33333H12.5V5H5ZM10 10C8.61667 10 7.5 11.1167 7.5 12.5C7.5 13.8833 8.61667 15 10 15C10 13.425 10.7417 11.95 11.9917 11.0083C11.5417 10.4167 10.8333 10 10 10ZM14.1667 11.6667V14.1667H11.6667V15.8333H14.1667V18.3333H15.8333V15.8333H18.3333V14.1667H15.8333V11.6667H14.1667Z"
                      fill="#0075FF"
                    />
                  </svg>
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  );
}
