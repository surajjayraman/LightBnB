-- Data for Tables

-- Users Data
INSERT INTO users (name, email, password)
VALUES ('Eva Stanley','sebastianguerra@ymail.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Louisa Meyer','jacksonrose@hotmail.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Dominic Parks','victoriablackwell@outlook.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

-- Properties Data
INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1, 'Moms', 'description', 'thumbnail url', 'cover url', 9230, 1, 0, 1, 'Canada', '213 William Cragg', 'Toronto','Province','M1M2M3', true),
(1, 'Playdium', 'description', 'thumbnail url', 'cover url', 1100, 1, 2, 1, 'Canada', '232 Here', 'Montreal', 'M1M2M3','Province', true),
(2, 'Cottage', 'description', 'thumbnail url', 'cover url', 400, 1, 2, 1, 'Canada', '454 There', 'New York', 'M1M2M3', 'Province',true),
(3, 'Spa', 'description', 'thumbnail url', 'cover url', 120, 2, 1, 1, 'Canada', '234 Everywhere', 'Toronto', 'M1M2M3', 'Province',true),
(3, 'Yurt', 'description', 'thumbnail url', 'cover url', 900, 1, 4, 5, 'Canada', '9098 Red st', 'Ottawa', 'M1M2M3', 'Province',true),
(2, 'Fun Times', 'description', 'thumbnail url', 'cover url', 150, 0, 2, 1, 'Canada', '5636 Blue st', 'Funland', 'M1M2M3', 'Province',true);

-- Reservations Data
INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2018-09-11', '2018-09-26', 2, 3),
('2019-01-04', '2019-02-01', 2, 2),
('2021-10-01', '2021-10-14', 1, 2),
('2014-10-21', '2014-10-21', 3, 1),
('2016-07-17', '2016-08-01', 3, 1);

-- Property Reviews Data
INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (2, 5, 1, 3, 'messages'),
(1, 2, 2, 3, 'messages'),
(2, 4, 3, 4, 'messages'),
(3, 1, 1, 2, 'messages'),
(2, 2, 4, 4, 'messages'),
(1, 1, 1, 1, 'messages');

