CREATE DATABASE IF NOT EXISTS cinemadb 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

USE cinemadb;

CREATE TABLE invalidated_token
(
    id          VARCHAR(255) NOT NULL,
    expiry_time datetime     NULL,
    CONSTRAINT pk_invalidatedtoken PRIMARY KEY (id)
);

CREATE TABLE permission
(
    name          VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NULL,
    CONSTRAINT pk_permission PRIMARY KEY (name)
);

CREATE TABLE `role`
(
    name          VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NULL,
    CONSTRAINT pk_role PRIMARY KEY (name)
);

CREATE TABLE role_permissions
(
    role_name        VARCHAR(255) NOT NULL,
    permissions_name VARCHAR(255) NOT NULL,
    CONSTRAINT pk_role_permissions PRIMARY KEY (role_name, permissions_name)
);

ALTER TABLE role_permissions
    ADD CONSTRAINT fk_rolper_on_permission FOREIGN KEY (permissions_name) REFERENCES permission (name);

ALTER TABLE role_permissions
    ADD CONSTRAINT fk_rolper_on_role FOREIGN KEY (role_name) REFERENCES `role` (name);

CREATE TABLE user
(
    user_id     VARCHAR(255) NOT NULL,
    username    VARCHAR(255) NULL,
    password    VARCHAR(255) NULL,
    email       VARCHAR(255) NULL,
    phone       VARCHAR(255) NULL,
    full_name   VARCHAR(255) NULL,
    birthday    date         NULL,
    joined_date date         NULL,
    avatar      VARCHAR(255) NULL,
    CONSTRAINT pk_user PRIMARY KEY (user_id)
);

CREATE TABLE user_roles
(
    user_user_id VARCHAR(255) NOT NULL,
    roles_name   VARCHAR(255) NOT NULL,
    CONSTRAINT pk_user_roles PRIMARY KEY (user_user_id, roles_name)
);

ALTER TABLE user_roles
    ADD CONSTRAINT fk_userol_on_role FOREIGN KEY (roles_name) REFERENCES `role` (name);

ALTER TABLE user_roles
    ADD CONSTRAINT fk_userol_on_user FOREIGN KEY (user_user_id) REFERENCES user (user_id);
    
CREATE TABLE tag
(
    id       VARCHAR(255) NOT NULL,
    tag_name VARCHAR(255) NULL,
    CONSTRAINT pk_tag PRIMARY KEY (id)
);

CREATE TABLE genre
(
    id         VARCHAR(255) NOT NULL,
    genre_name VARCHAR(255) NULL,
    CONSTRAINT pk_genre PRIMARY KEY (id)
);

CREATE TABLE movie
(
    id          VARCHAR(255) NOT NULL,
    movie_image VARCHAR(255) NULL,
    movie_price FLOAT        NOT NULL,
    movie_name  VARCHAR(255) NULL,
    duration    INT          NOT NULL,
    status      VARCHAR(255) NULL,
    CONSTRAINT pk_movie PRIMARY KEY (id)
);

CREATE TABLE movie_genres
(
    movie_id  VARCHAR(255) NOT NULL,
    genres_id VARCHAR(255) NOT NULL,
    CONSTRAINT pk_movie_genres PRIMARY KEY (movie_id, genres_id)
);

CREATE TABLE movie_tags
(
    movie_id VARCHAR(255) NOT NULL,
    tags_id  VARCHAR(255) NOT NULL,
    CONSTRAINT pk_movie_tags PRIMARY KEY (movie_id, tags_id)
);

ALTER TABLE movie_genres
    ADD CONSTRAINT fk_movgen_on_genre FOREIGN KEY (genres_id) REFERENCES genre (id);

ALTER TABLE movie_genres
    ADD CONSTRAINT fk_movgen_on_movie FOREIGN KEY (movie_id) REFERENCES movie (id);

ALTER TABLE movie_tags
    ADD CONSTRAINT fk_movtag_on_movie FOREIGN KEY (movie_id) REFERENCES movie (id);

ALTER TABLE movie_tags
    ADD CONSTRAINT fk_movtag_on_tag FOREIGN KEY (tags_id) REFERENCES tag (id);

CREATE TABLE show_schedule
(
    id        VARCHAR(255) NOT NULL,
    show_date date         NULL,
    movie_id  VARCHAR(255) NULL,
    CONSTRAINT pk_showschedule PRIMARY KEY (id)
);

ALTER TABLE show_schedule
    ADD CONSTRAINT FK_SHOWSCHEDULE_ON_MOVIE FOREIGN KEY (movie_id) REFERENCES movie (id);

CREATE TABLE showtime
(
    id         VARCHAR(255) NOT NULL,
    start_time VARCHAR(255) NULL,
    end_time   VARCHAR(255) NULL,
    CONSTRAINT pk_showtime PRIMARY KEY (id)
);

CREATE TABLE show_room
(
    id             VARCHAR(255) NOT NULL,
    show_room_name VARCHAR(255) NULL,
    CONSTRAINT pk_showroom PRIMARY KEY (id)
);

CREATE TABLE show_event
(
    id           VARCHAR(255) NOT NULL,
    showtime_id  VARCHAR(255) NULL,
    show_room_id VARCHAR(255) NULL,
    CONSTRAINT pk_showevent PRIMARY KEY (id)
);

ALTER TABLE show_event
    ADD CONSTRAINT FK_SHOWEVENT_ON_SHOWROOM FOREIGN KEY (show_room_id) REFERENCES show_room (id);

ALTER TABLE show_event
    ADD CONSTRAINT FK_SHOWEVENT_ON_SHOWTIME FOREIGN KEY (showtime_id) REFERENCES showtime (id);

CREATE TABLE seat
(
    id           VARCHAR(255) NOT NULL,
    seat_name    VARCHAR(255) NULL,
    show_room_id VARCHAR(255) NULL,
    CONSTRAINT pk_seat PRIMARY KEY (id)
);

ALTER TABLE seat
    ADD CONSTRAINT FK_SEAT_ON_SHOWROOM FOREIGN KEY (show_room_id) REFERENCES show_room (id);
    
CREATE TABLE promotion
(
    id             VARCHAR(255) NOT NULL,
    promotion_name VARCHAR(255) NULL,
    discount_value FLOAT        NOT NULL,
    CONSTRAINT pk_promotion PRIMARY KEY (id)
);

CREATE TABLE item
(
    id         VARCHAR(255) NOT NULL,
    item_name  VARCHAR(255) NULL,
    item_type  VARCHAR(255) NULL,
    item_price BIGINT       NOT NULL,
    CONSTRAINT pk_item PRIMARY KEY (id)
);

CREATE TABLE bill
(
    id            VARCHAR(255)  NOT NULL,
    total_amount  FLOAT         NOT NULL,
    customer_paid FLOAT         NOT NULL,
    pdf_url       VARCHAR(2048) NULL,
    promotion_id  VARCHAR(255)  NULL,
    CONSTRAINT pk_bill PRIMARY KEY (id)
);

CREATE TABLE bill_items
(
    bill_id  VARCHAR(255) NOT NULL,
    items_id VARCHAR(255) NOT NULL,
    CONSTRAINT pk_bill_items PRIMARY KEY (bill_id, items_id)
);

ALTER TABLE bill
    ADD CONSTRAINT FK_BILL_ON_PROMOTION FOREIGN KEY (promotion_id) REFERENCES promotion (id);

ALTER TABLE bill_items
    ADD CONSTRAINT fk_bilite_on_bill FOREIGN KEY (bill_id) REFERENCES bill (id);

ALTER TABLE bill_items
    ADD CONSTRAINT fk_bilite_on_item FOREIGN KEY (items_id) REFERENCES item (id);    

CREATE TABLE ticket
(
    id            VARCHAR(255) NOT NULL,
    ticket_price  FLOAT        NOT NULL,
    created_date  date         NULL,
    status        VARCHAR(255) NULL,
    booking_type  VARCHAR(255) NULL,
    show_event_id VARCHAR(255) NULL,
    bill_id       VARCHAR(255) NULL,
    seat_id       VARCHAR(255) NULL,
    customer_id   VARCHAR(255) NULL,
    staff_id      VARCHAR(255) NULL,
    movie_id      VARCHAR(255) NULL,
    CONSTRAINT pk_ticket PRIMARY KEY (id)
);

ALTER TABLE ticket
    ADD CONSTRAINT FK_TICKET_ON_BILL FOREIGN KEY (bill_id) REFERENCES bill (id);

ALTER TABLE ticket
    ADD CONSTRAINT FK_TICKET_ON_CUSTOMER FOREIGN KEY (customer_id) REFERENCES user (user_id);

ALTER TABLE ticket
    ADD CONSTRAINT FK_TICKET_ON_MOVIE FOREIGN KEY (movie_id) REFERENCES movie (id);

ALTER TABLE ticket
    ADD CONSTRAINT FK_TICKET_ON_SEAT FOREIGN KEY (seat_id) REFERENCES seat (id);

ALTER TABLE ticket
    ADD CONSTRAINT FK_TICKET_ON_SHOWEVENT FOREIGN KEY (show_event_id) REFERENCES show_event (id);

ALTER TABLE ticket
    ADD CONSTRAINT FK_TICKET_ON_STAFF FOREIGN KEY (staff_id) REFERENCES user (user_id);

CREATE TABLE comment
(
    id             VARCHAR(255) NOT NULL,
    content        VARCHAR(255) NULL,
    sentiment      VARCHAR(255) NULL,
    model_response VARCHAR(255) NULL,
    created_date   date         NULL,
    movie_id       VARCHAR(255) NULL,
    user_user_id   VARCHAR(255) NULL,
    CONSTRAINT pk_comment PRIMARY KEY (id)
);

ALTER TABLE comment
    ADD CONSTRAINT FK_COMMENT_ON_MOVIE FOREIGN KEY (movie_id) REFERENCES movie (id);

ALTER TABLE comment
    ADD CONSTRAINT FK_COMMENT_ON_USER_USERID FOREIGN KEY (user_user_id) REFERENCES user (user_id);