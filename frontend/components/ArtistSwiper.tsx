import styles from "../styles/ArtistSwiper.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const ArtistSwiper: React.FC = () => {
  return (
    <Swiper
      className={styles.Swiper}
      spaceBetween={37}
      slidesPerView={3}
      onSlideChange={() => console.log("slide change")}
      loop={true}
      centeredSlides={true}
    >
      <SwiperSlide>Slide 1</SwiperSlide>
      <SwiperSlide>Slide 2</SwiperSlide>
      <SwiperSlide>Slide 3</SwiperSlide>
      <SwiperSlide>Slide 4</SwiperSlide>
      <SwiperSlide>Slide 5</SwiperSlide>
      <SwiperSlide>Slide 6</SwiperSlide>
    </Swiper>
  );
};

export default ArtistSwiper;
