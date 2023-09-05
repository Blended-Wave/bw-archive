import Link from "next/link";
import styles from "../../../styles/Admin.work.module.css";
import { useRef, useState } from "react";

export default function work() {
  const ModalBackground = useRef();
  const [workmodalOpen, setWorkmodalOpen] = useState(false);
  const [artistmodalOpen, setArtistmodalOpen] = useState(false);

  return (
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
        <Link className={styles.manage} href="/admin">
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
        <Link className={styles.manage_active} href="/admin/work">
          <svg
            width="4"
            height="30"
            viewBox="0 0 4 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path id="Vector 1" d="M2 0V30" stroke="#5C4B4B" stroke-width="4" />
          </svg>
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
        <p className={styles.content_info}>작업물 관리</p>
        <p className={styles.content_info}>
          작업물을 업로드, 수정, 삭제할 수 있습니다. 작업물을 클릭 시 수정
          페이지로 이동하며 수정 페이지에서 작업물의 설명, 작업물 미리보기 등을
          확인할 수 있습니다.
          <br />
          시리즈 이름은 추후 업데이트를 통한 기능 추가로 인해 입력 방식이 변경될
          수 있습니다.
        </p>
        <button
          className={styles.work_plus}
          onClick={() => setWorkmodalOpen(true)}
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
          <p>작업물 추가</p>
        </button>
        <table className={styles.data}>
          <tr>
            <th>ID</th>
            <th>Thumnail</th>
            <th>Type</th>
            <th>Art Title</th>
            <th>Series Name</th>
            <th>Credit</th>
            <th>Datetime</th>
            <th>Delete</th>
          </tr>
          <tr>
            <td>1</td>
            <td onClick={() => setWorkmodalOpen(true)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="124"
                height="113"
                viewBox="0 0 124 113"
                fill="none"
              >
                <rect x="17" y="11" width="90" height="90" fill="#DDDDDD" />
              </svg>
            </td>
            <td>video</td>
            <td>Lorem Ipsum</td>
            <td>Lorem Ipsum</td>
            <td>
              DISUCZZ
              <br />
              GUEST
            </td>
            <td>
              2023.05.29
              <br />
              02:26
            </td>
            <td>
              <button className={styles.delete}>삭제</button>
            </td>
          </tr>
          <tr>
            <td>1</td>
            <td onClick={() => setWorkmodalOpen(true)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="124"
                height="113"
                viewBox="0 0 124 113"
                fill="none"
              >
                <rect x="17" y="11" width="90" height="90" fill="#DDDDDD" />
              </svg>
            </td>
            <td>video</td>
            <td>Lorem Ipsum</td>
            <td>Lorem Ipsum</td>
            <td>
              DISUCZZ
              <br />
              GUEST
            </td>
            <td>
              2023.05.29
              <br />
              02:26
            </td>
            <td>
              <button className={styles.delete}>삭제</button>
            </td>
          </tr>
          <tr>
            <td>1</td>
            <td onClick={() => setWorkmodalOpen(true)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="124"
                height="113"
                viewBox="0 0 124 113"
                fill="none"
              >
                <rect x="17" y="11" width="90" height="90" fill="#DDDDDD" />
              </svg>
            </td>
            <td>video</td>
            <td>Lorem Ipsum</td>
            <td>Lorem Ipsum</td>
            <td>
              DISUCZZ
              <br />
              GUEST
            </td>
            <td>
              2023.05.29
              <br />
              02:26
            </td>
            <td>
              <button className={styles.delete}>삭제</button>
            </td>
          </tr>
        </table>
      </div>
      {workmodalOpen && (
        <div
          className={styles.modal_container}
          ref={ModalBackground}
          onClick={(e) => {
            if (e.target === ModalBackground.current) {
              setWorkmodalOpen(false);
            }
          }}
        >
          <div className={styles.workmodal_content}>
            <div className={styles.modal_work}>
              <div className={styles.modal_title}>
                <p style={{ width: "28px", height: "20px" }}>제목</p>
                <div className={styles.modal_title_box}>
                  <p>작업물 제목입니다.</p>
                </div>
              </div>
              <div className={styles.modal_series}>
                <p style={{ width: "41px", height: "20px" }}>시리즈</p>
                <div className={styles.modal_series_box}>
                  <p>시리즈 이름입니다.</p>
                </div>
              </div>
              <div className={styles.modal_info}>
                <p style={{ width: "28px", height: "20px", margin: "5px 0 0" }}>
                  설명
                </p>
                <div className={styles.modal_info_box}>
                  <p>작품에 대한 설명입니다.</p>
                </div>
              </div>
              <div className={styles.modal_artist}>
                <p>아티스트</p>
                <div
                  onClick={() => {
                    setArtistmodalOpen(true);
                  }}
                >
                  검색
                </div>
                <div className={styles.modal_artist_name}>DISCUZZ</div>
                <div className={styles.modal_artist_name}>UserName</div>
              </div>
              <div className={styles.modal_file}>
                <p
                  style={{
                    width: "28px",
                    height: "20px",
                    margin: "5px 19px 0 0",
                  }}
                >
                  파일
                </p>
                <div
                  className={styles.modal_file_button}
                  style={{ margin: "0 16px 0 0" }}
                >
                  <button>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="19"
                      height="19"
                      viewBox="0 0 19 19"
                      fill="none"
                    >
                      <path
                        d="M7.12504 7.91667V12.6667H11.875V7.91667H15.0417L9.50004 2.375L3.95837 7.91667H7.12504ZM9.50004 4.59167L11.2417 6.33333H10.2917V11.0833H8.70837V6.33333H7.75837L9.50004 4.59167ZM15.0417 14.25H3.95837V15.8333H15.0417V14.25Z"
                        fill="#44B17D"
                      />
                    </svg>
                    Upload
                  </button>
                  <p>*최대 00mb</p>
                  <button>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="19"
                      height="19"
                      viewBox="0 0 19 19"
                      fill="none"
                    >
                      <path
                        d="M3.95829 15.0417C3.95829 15.4616 4.12511 15.8643 4.42204 16.1613C4.71897 16.4582 5.1217 16.625 5.54163 16.625H11.875C12.2949 16.625 12.6976 16.4582 12.9945 16.1613C13.2915 15.8643 13.4583 15.4616 13.4583 15.0417V5.54167H3.95829V15.0417ZM5.54163 7.125H11.875V15.0417H5.54163V7.125ZM11.4791 3.16667L10.6875 2.375H6.72913L5.93746 3.16667H3.16663V4.75H14.25V3.16667H11.4791Z"
                        fill="#D04141"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
                <div className={styles.modal_file_box}></div>
              </div>
              <div className={styles.modal_file_info}>
                <p>파일 타입 : mp4</p>
                <p>파일 크기 : 254mb</p>
              </div>
            </div>
            <div className={styles.modal_checkbox}>
              <p>
                <input type="checkbox" />
                WORK 페이지 상단 고정
              </p>
              <p>
                <input type="checkbox" />
                비공개
              </p>
            </div>
            <div className={styles.modal_preview}>
              <div className={styles.modal_thumnail}>썸네일(미리보기)</div>
              <img></img>
              <div className={styles.modal_preview_update}>
                <button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="19"
                    viewBox="0 0 19 19"
                    fill="none"
                  >
                    <path
                      d="M7.12504 7.91667V12.6667H11.875V7.91667H15.0417L9.50004 2.375L3.95837 7.91667H7.12504ZM9.50004 4.59167L11.2417 6.33333H10.2917V11.0833H8.70837V6.33333H7.75837L9.50004 4.59167ZM15.0417 14.25H3.95837V15.8333H15.0417V14.25Z"
                      fill="#44B17D"
                    />
                  </svg>
                  Upload
                </button>
                <p>* 최대 00 mb</p>
              </div>
              <p className={styles.modal_thumnail_info}>
                상단의 미리보기는 250 x 250px 기준으로 제작되었습니다.
                <br />
                <br />
                픽셀을 맞추지 않아도 업로드는 가능하지만
                <br /> 임의로 잘리거나 비율이 깨진 채 업로드 되므로, <br />
                가로 세로 1:1 비율은 유지하는 것을 권장합니다.
              </p>
              <div className={styles.modal_work_button}>
                <button
                  className={styles.modal_close_button}
                  onClick={() => {
                    setWorkmodalOpen(false);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="19"
                    viewBox="0 0 19 19"
                    fill="none"
                  >
                    <path
                      d="M15.8334 5.4705L13.5297 3.16675L9.50008 7.19633L5.4705 3.16675L3.16675 5.4705L7.19633 9.50008L3.16675 13.5297L5.4705 15.8334L9.50008 11.8038L13.5297 15.8334L15.8334 13.5297L11.8038 9.50008L15.8334 5.4705Z"
                      fill="#D04141"
                    />
                  </svg>
                  Close
                </button>
                <div className={styles.modal_preview_publish}>
                  <button>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="19"
                      height="19"
                      viewBox="0 0 19 19"
                      fill="none"
                    >
                      <path
                        d="M7.12508 10.2916C7.12508 10.9215 7.3753 11.5256 7.8207 11.971C8.2661 12.4164 8.87019 12.6666 9.50008 12.6666C10.13 12.6666 10.7341 12.4164 11.1795 11.971C11.6249 11.5256 11.8751 10.9215 11.8751 10.2916C11.8751 9.6617 11.6249 9.05761 11.1795 8.61221C10.7341 8.16681 10.13 7.91659 9.50008 7.91659C8.87019 7.91659 8.2661 8.16681 7.8207 8.61221C7.3753 9.05761 7.12508 9.6617 7.12508 10.2916ZM15.8334 15.5087V6.33325L11.0834 1.58325H4.75008C4.33016 1.58325 3.92743 1.75007 3.6305 2.047C3.33356 2.34393 3.16675 2.74666 3.16675 3.16659V15.8333C3.16675 16.2532 3.33356 16.6559 3.6305 16.9528C3.92743 17.2498 4.33016 17.4166 4.75008 17.4166H14.2501C14.6063 17.4166 14.923 17.2978 15.1922 17.0999L11.6851 13.5928C11.0517 14.0045 10.2917 14.2499 9.50008 14.2499C8.45027 14.2499 7.44345 13.8329 6.70112 13.0905C5.95879 12.3482 5.54175 11.3414 5.54175 10.2916C5.54175 9.24177 5.95879 8.23495 6.70112 7.49262C7.44345 6.75029 8.45027 6.33325 9.50008 6.33325C10.5499 6.33325 11.5567 6.75029 12.299 7.49262C13.0414 8.23495 13.4584 9.24177 13.4584 10.2916C13.4584 11.0833 13.213 11.8433 12.8013 12.4687L15.8334 15.5087Z"
                        fill="black"
                      />
                    </svg>
                    Preview
                  </button>
                  <button>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="17"
                      height="17"
                      viewBox="0 0 17 17"
                      fill="none"
                    >
                      <path
                        d="M13.9541 9.13758L9.91659 13.1751H8.28742V11.5459L12.3249 7.50842L13.9541 9.13758ZM16.3624 8.57092C16.3624 8.78342 16.1499 8.99591 15.9374 9.20842L14.1666 10.9792L13.5291 10.3417L15.3708 8.50008L14.9458 8.07508L14.4499 8.57092L12.8208 6.94175L14.3791 5.45425C14.5208 5.31258 14.8041 5.31258 15.0166 5.45425L16.0083 6.44592C16.1499 6.58758 16.1499 6.87091 16.0083 7.08342C15.8666 7.22508 15.7249 7.36675 15.7249 7.50842C15.7249 7.65008 15.8666 7.79175 16.0083 7.93341C16.2208 8.14592 16.4333 8.35842 16.3624 8.57092ZM2.12492 14.1667V2.83341H7.08325V6.37508H10.6249V7.43758L12.0416 6.02092V5.66675L7.79159 1.41675H2.12492C1.34575 1.41675 0.708252 2.05425 0.708252 2.83341V14.1667C0.708252 14.9459 1.34575 15.5834 2.12492 15.5834H10.6249C11.4041 15.5834 12.0416 14.9459 12.0416 14.1667H2.12492ZM7.79159 12.1126C7.64992 12.1126 7.50825 12.1834 7.43742 12.1834L7.08325 10.6251H6.02075L4.53325 11.8292L4.95825 9.91675H3.89575L3.18742 13.4584H4.24992L6.30409 11.6167L6.72909 13.2459H7.43742L7.79159 13.1751V12.1126Z"
                        fill="#3DACC5"
                      />
                    </svg>
                    Publish
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {workmodalOpen && artistmodalOpen && (
        <div className={styles.artistmodal_container}>
          <div className={styles.artistmodal_content}>
            <div className={styles.member_list}>
              <p>맴버 리스트</p>
              <select size="8" multiple>
                <option>DISCUZZ</option>
                <option>GUEST1</option>
                <option>GUEST2</option>
                <option>GUEST3</option>
                <option>UserName</option>
                <option>UserName</option>
                <option>UserName</option>
                <option>UserName</option>
                <option>UserName</option>
                <option>UserName</option>
                <option>UserName</option>
                <option>UserName</option>
                <option>UserName</option>
                <option>UserName</option>
              </select>
            </div>
            <div className={styles.artist_list}>
              <p>아티스트</p>
              <div style={{ display: "flex" }}>
                <div className={styles.artist_box}>DISCUZZ</div>
                <div className={styles.artist_box}>UserName</div>
              </div>
            </div>
            <button className={styles.submit_button}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="12"
                viewBox="0 0 14 12"
                fill="none"
              >
                <path
                  d="M0 12L13.1171 6L0 0V4.66667L9.36937 6L0 7.33333V12Z"
                  fill="#3DACC5"
                />
              </svg>
              Submit
            </button>
            <svg
              onClick={() => {
                setArtistmodalOpen(false);
              }}
              className={styles.close_button}
              xmlns="http://www.w3.org/2000/svg"
              width="19"
              height="19"
              viewBox="0 0 19 19"
              fill="none"
            >
              <path
                d="M15.8334 5.4705L13.5297 3.16675L9.50008 7.19633L5.4705 3.16675L3.16675 5.4705L7.19633 9.50008L3.16675 13.5297L5.4705 15.8334L9.50008 11.8038L13.5297 15.8334L15.8334 13.5297L11.8038 9.50008L15.8334 5.4705Z"
                fill="#D04141"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
