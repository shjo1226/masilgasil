create extension if not exists "pgcrypto";

create table if not exists users (
  id bigserial primary key,
  nickname varchar(20) unique not null,
  sex varchar(8),
  birth_date date,
  height integer,
  weight integer,
  exercise_intensity varchar(15),
  profile_img varchar(500),
  total_distance integer not null default 0,
  total_count integer not null default 0,
  total_calories integer not null default 0,
  is_public boolean not null default true,
  provider varchar(20),
  social_id varchar(100) unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists posts (
  id bigserial primary key,
  user_id bigint not null references users(id) on delete cascade,
  depth1 varchar(20) not null,
  depth2 varchar(20),
  depth3 varchar(20) not null,
  depth4 varchar(20),
  path jsonb not null,
  title varchar(30) not null,
  content text,
  thumbnail_url varchar(1024),
  distance integer not null,
  total_time integer not null,
  is_public boolean not null default true,
  view_count integer not null default 0,
  like_count integer not null default 0,
  pins jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists post_likes (
  user_id bigint not null references users(id) on delete cascade,
  post_id bigint not null references posts(id) on delete cascade,
  is_like boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, post_id)
);

create table if not exists masils (
  id bigserial primary key,
  user_id bigint not null references users(id) on delete cascade,
  post_id bigint references posts(id) on delete set null,
  depth1 varchar(20) not null,
  depth2 varchar(20),
  depth3 varchar(20) not null,
  depth4 varchar(20),
  path jsonb not null,
  content text,
  thumbnail_url varchar(1024),
  distance integer not null,
  total_time integer not null,
  calories integer not null,
  started_at timestamptz not null,
  pins jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists mates (
  id bigserial primary key,
  author_id bigint not null references users(id) on delete cascade,
  post_id bigint not null references posts(id) on delete cascade,
  depth1 varchar(20) not null,
  depth2 varchar(20) not null,
  depth3 varchar(20) not null,
  depth4 varchar(20) not null,
  title varchar(30) not null,
  content text not null,
  gathering_place_point jsonb not null,
  gathering_place_detail varchar(50) not null,
  gathering_at timestamptz not null,
  capacity integer not null,
  status varchar(15) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists mate_participants (
  id bigserial primary key,
  user_id bigint not null references users(id) on delete cascade,
  mate_id bigint not null references mates(id) on delete cascade,
  message varchar(255),
  status varchar(12) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table users enable row level security;
alter table posts enable row level security;
alter table post_likes enable row level security;
alter table masils enable row level security;
alter table mates enable row level security;
alter table mate_participants enable row level security;

create policy "service role manages users" on users for all using (true) with check (true);
create policy "service role manages posts" on posts for all using (true) with check (true);
create policy "service role manages post likes" on post_likes for all using (true) with check (true);
create policy "service role manages masils" on masils for all using (true) with check (true);
create policy "service role manages mates" on mates for all using (true) with check (true);
create policy "service role manages participants" on mate_participants for all using (true) with check (true);
