CREATE TABLE country(
    id SERIAL, 
    name character varying(50));

CREATE TABLE boat(
    Id SERIAL,
     name character varying(50),
     type character varying(20),
     capacity integer);

CREATE TABLE travel(
    country character varying(50),
    boat character varying(50));

INSERT INTO country(name)
VALUES
('Turkey'),
('Greece'),
('France'),
('Italy');
