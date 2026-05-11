CREATE TABLE users (
    id text PRIMARY KEY,
    name text NOT NULL,
    pfp text NOT NULL,
    bday_month integer,
    bday_day integer,
    channel_name text,
    channel_id text
);
