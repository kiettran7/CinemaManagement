import React, { createContext, useContext, useState } from 'react';

const MovieContext = createContext();

export const MovieContextProvider = ({ children }) => {
    const [ open, setOpen ] = useState(false);
    const [ selectedMovie, setSelectedMovie ] = useState(null);
    const [ type, setType ] = useState(null);

    const carouselData = [
        { id: 1, img: 'https://www.bhdstar.vn/wp-content/uploads/2024/07/z5613171744010_daba8a7c9ef95a2e8ec1e3511bcd0ee6.jpg' },
        { id: 2, img: 'https://www.bhdstar.vn/wp-content/uploads/2024/07/z5613171762164_5c6451cbc2e353eed46a4b819ab386b8.jpg' }
    ];

    const sliderShowing = [
        { id: 1, img: 'https://www.bhdstar.vn/wp-content/uploads/2024/04/referenceSchemeHeadOfficeallowPlaceHoldertrueheight700ldapp-35.jpg',
            title: 'Lật mặt 7 : Một điều ước', category: 'Healing' },
        { id: 2, img: 'https://www.bhdstar.vn/wp-content/uploads/2024/06/referenceSchemeHeadOfficeallowPlaceHoldertrueheight700ldapp-2.jpg',
            title: 'How to make millions: Gia tài của ngoại', category: 'Drama' },
        { id: 3, img: 'https://www.bhdstar.vn/wp-content/uploads/2024/06/referenceSchemeHeadOfficeallowPlaceHoldertrueheight700ldapp-1.png', 
            title: 'Inside out 2: Những mảnh ghép cảm xúc 2', category: 'Animation' },
        { id: 4, img: 'https://www.bhdstar.vn/wp-content/uploads/2024/06/referenceSchemeHeadOfficeallowPlaceHoldertrueheight700ldapp-7.jpg', 
            title: 'Twilight of the warriors: Cửu long thành trại', category: 'Action' },
        { id: 5, img: 'https://www.bhdstar.vn/wp-content/uploads/2024/06/referenceSchemeHeadOfficeallowPlaceHoldertrueheight700ldapp-6.jpg', 
            title: 'A quiet place: Vùng đất câm lặng: Ngày một', category: 'Horror' },
        { id: 6, img: 'https://www.bhdstar.vn/wp-content/uploads/2024/06/referenceSchemeHeadOfficeallowPlaceHoldertrueheight700ldapp-29.png', 
            title: 'Despicable me: Kẻ trộm mặt trăng 4', category: 'Animation' },
        { id: 7, img: 'https://www.bhdstar.vn/wp-content/uploads/2024/07/referenceSchemeHeadOfficeallowPlaceHoldertrueheight700ldapp-51.jpg', 
            title: 'Long distance', category: 'Action / Adventure' },
        { id: 8, img: 'https://www.bhdstar.vn/wp-content/uploads/2024/07/referenceSchemeHeadOfficeallowPlaceHoldertrueheight700ldapp-50.jpg', 
            title: 'Twisters: Lốc xoáy tử thần', category: 'Thriller' },
        { id: 9, img: 'https://www.bhdstar.vn/wp-content/uploads/2024/07/referenceSchemeHeadOfficeallowPlaceHoldertrueheight700ldapp-48.jpg', 
            title: 'Oh my ghost the finale: Ôi ma ơi: Hồi kết', category: 'Horror' },
        { id: 10, img: 'https://www.bhdstar.vn/wp-content/uploads/2024/07/referenceSchemeHeadOfficeallowPlaceHoldertrueheight700ldapp-47.jpg', 
            title: 'Hello Jadoo special: Đại dương diệu kỳ', category: 'Animation' },
        { id: 11, img: 'https://www.bhdstar.vn/wp-content/uploads/2024/07/referenceSchemeHeadOfficeallowPlaceHoldertrueheight700ldapp-53.jpg', 
            title: 'Hijack 1971: Vây hãm trên không', category: 'Action' },
        { id: 12, img: 'https://www.bhdstar.vn/wp-content/uploads/2024/07/referenceSchemeHeadOfficeallowPlaceHoldertrueheight700ldapp-45.jpg', 
            title: 'Project silence: Dự án mật: Thảm họa trên cầu', category: 'Action' },
        { id: 13, img: 'https://www.bhdstar.vn/wp-content/uploads/2024/07/referenceSchemeHeadOfficeallowPlaceHoldertrueheight700ldapp-46.jpg', 
            title: 'My boo: Bé ma của anh', category: 'Horror' },
        { id: 14, img: 'https://www.bhdstar.vn/wp-content/uploads/2024/07/referenceSchemeHeadOfficeallowPlaceHoldertrueheight700ldapp-1.png', 
            title: 'Deadpool and wolverine', category: 'Action' },
        { id: 15, img: 'https://www.bhdstar.vn/wp-content/uploads/2024/07/referenceSchemeHeadOfficeallowPlaceHoldertrueheight700ldapp-3.png', 
            title: 'Detective conan: Ngôi sao 5 cánh 1 triệu đô', category: 'Animation' }
    ];

    const sliderComing = [
        { id: 1, img: 'https://www.bhdstar.vn/wp-content/uploads/2024/07/referenceSchemeHeadOfficeallowPlaceHoldertrueheight700ldapp-55.jpg',
            title: 'Grave Torture', category: 'Horror' },
        { id: 2, img: 'https://www.bhdstar.vn/wp-content/uploads/2024/07/referenceSchemeHeadOfficeallowPlaceHoldertrueheight700ldapp-44.jpg',
            title: 'Blackpink world tour born pink in cinemas', category: 'Musical' },
        { id: 3, img: 'https://www.bhdstar.vn/wp-content/uploads/2024/06/referenceSchemeHeadOfficeallowPlaceHoldertrueheight700ldapp-5.jpg', 
            title: 'Harold: Harold và cây bút phép thuật', category: 'Comedy' },
        { id: 4, img: 'https://www.bhdstar.vn/wp-content/uploads/2024/07/referenceSchemeHeadOfficeallowPlaceHoldertrueheight700ldapp-68.jpg', 
            title: 'Borderlands: Trở lại Pandora', category: 'Action' },
        { id: 5, img: 'https://www.bhdstar.vn/wp-content/uploads/2024/07/referenceSchemeHeadOfficeallowPlaceHoldertrueheight700ldapp.png', 
            title: 'Ma da', category: 'Horror' },
        { id: 6, img: 'https://www.bhdstar.vn/wp-content/uploads/2024/07/referenceSchemeHeadOfficeallowPlaceHoldertrueheight700ldapp-76.jpg', 
            title: 'Revolver', category: 'Action' },
        { id: 7, img: 'https://www.bhdstar.vn/wp-content/uploads/2024/07/referenceSchemeHeadOfficeallowPlaceHoldertrueheight700ldapp-43.jpg', 
            title: 'Làm giàu với ma', category: 'Drama' },
        { id: 8, img: 'https://www.bhdstar.vn/wp-content/uploads/2024/07/referenceSchemeHeadOfficeallowPlaceHoldertrueheight700ldapp-52.jpg', 
            title: 'Pilot: Chàng nữ phi công', category: 'Comedy' },
        { id: 9, img: 'https://www.bhdstar.vn/wp-content/uploads/2024/07/referenceSchemeHeadOfficeallowPlaceHoldertrueheight700ldapp-2.png', 
            title: 'Little eggs: Khai phá kỷ băng hà', category: 'Animation' },
        { id: 10, img: 'https://www.bhdstar.vn/wp-content/uploads/2024/07/referenceSchemeHeadOfficeallowPlaceHoldertrueheight700ldapp-69.jpg', 
            title: 'Speak no evil: Không nói điều dữ', category: 'Horror' },
        { id: 11, img: 'https://www.bhdstar.vn/wp-content/uploads/2024/06/referenceSchemeHeadOfficeallowPlaceHoldertrueheight700ldapp-21.jpg', 
            title: 'Transformers one', category: 'Animation' },
        { id: 12, img: 'https://www.bhdstar.vn/wp-content/uploads/2024/07/referenceSchemeHeadOfficeallowPlaceHoldertrueheight700ldapp-77.jpg', 
            title: 'The wild robot', category: 'Animation' },
        { id: 13, img: 'https://www.bhdstar.vn/wp-content/uploads/2024/07/referenceSchemeHeadOfficeallowPlaceHoldertrueheight700ldapp-71.jpg', 
            title: 'Smile: Cười 2', category: 'Horror' },
        { id: 14, img: 'https://www.bhdstar.vn/wp-content/uploads/2024/05/referenceSchemeHeadOfficeallowPlaceHoldertrueheight700ldapp-12.png', 
            title: 'Ngày xưa có một chuyện tình', category: 'Romance' },
        { id: 15, img: 'https://www.bhdstar.vn/wp-content/uploads/2024/07/referenceSchemeHeadOfficeallowPlaceHoldertrueheight700ldapp-70.jpg', 
            title: 'Gladiator: Võ sĩ giác đấu 2', category: 'Action' },
        { id: 16, img: 'https://www.bhdstar.vn/wp-content/uploads/2024/04/referenceSchemeHeadOfficeallowPlaceHoldertrueheight700ldapp-14.jpg', 
            title: 'Nhà gia tiên', category: 'Mystery' }
    ];

    const openModal = (movie, type) => {
        setOpen(true);
        setSelectedMovie(movie);
        setType(type);
    };

    const closeModal = () => {
        setOpen(false);
        setSelectedMovie(null);
        setType(null);
    };

    const goBuyTicket = (movie) => {
        setSelectedMovie(movie);
        localStorage.setItem('selectedMovie', JSON.stringify(movie));
    }

    return (
        <MovieContext.Provider value={{ open, openModal, closeModal, sliderShowing, sliderComing, selectedMovie, type, carouselData,
            goBuyTicket, setSelectedMovie }}>
            { children }
        </MovieContext.Provider>
    );
};

export const useMovieContext = () => useContext(MovieContext)