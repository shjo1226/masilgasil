insert into users (
  id,
  nickname,
  sex,
  birth_date,
  height,
  weight,
  exercise_intensity,
  profile_img,
  total_distance,
  total_count,
  total_calories,
  is_public,
  provider,
  social_id
)
values
  (1, '마실가실', 'FEMALE', '1998-06-01', 167, 58, 'NORMAL', '/images/userProfile.svg', 12430, 16, 840, true, 'kakao', 'mock-kakao-1'),
  (2, '한강러너', 'MALE', '1995-03-12', 176, 72, 'HIGH', '/images/userProfile.svg', 28750, 31, 2180, true, 'kakao', 'mock-kakao-2'),
  (3, '공원산책자', 'FEMALE', '1997-11-20', 163, 54, 'NORMAL', '/images/userProfile.svg', 18540, 24, 1260, true, 'kakao', 'mock-kakao-3'),
  (4, '노을수집가', 'FEMALE', '1994-07-08', 160, 50, 'LOW', '/images/userProfile.svg', 9820, 13, 690, true, 'kakao', 'mock-kakao-4'),
  (5, '도심워커', 'MALE', '1992-09-14', 181, 78, 'NORMAL', '/images/userProfile.svg', 22410, 27, 1740, true, 'kakao', 'mock-kakao-5'),
  (6, '숲길친구', 'FEMALE', '1999-01-25', 165, 57, 'NORMAL', '/images/userProfile.svg', 15600, 19, 1120, true, 'kakao', 'mock-kakao-6'),
  (7, '골목탐험가', 'MALE', '1996-05-03', 173, 68, 'LOW', '/images/userProfile.svg', 13420, 18, 920, true, 'kakao', 'mock-kakao-7'),
  (8, '카페산책러', 'FEMALE', '1993-12-18', 158, 49, 'NORMAL', '/images/userProfile.svg', 20110, 22, 1430, true, 'kakao', 'mock-kakao-8'),
  (9, '강변메이트', 'MALE', '1991-02-27', 178, 74, 'HIGH', '/images/userProfile.svg', 31520, 36, 2540, true, 'kakao', 'mock-kakao-9'),
  (10, '느린마실', 'FEMALE', '2000-08-09', 162, 52, 'LOW', '/images/userProfile.svg', 8910, 11, 610, true, 'kakao', 'mock-kakao-10')
on conflict (id) do update set
  nickname = excluded.nickname,
  sex = excluded.sex,
  birth_date = excluded.birth_date,
  height = excluded.height,
  weight = excluded.weight,
  exercise_intensity = excluded.exercise_intensity,
  profile_img = excluded.profile_img,
  total_distance = excluded.total_distance,
  total_count = excluded.total_count,
  total_calories = excluded.total_calories,
  is_public = excluded.is_public,
  provider = excluded.provider,
  social_id = excluded.social_id;

insert into posts (
  id,
  user_id,
  depth1,
  depth2,
  depth3,
  depth4,
  path,
  title,
  content,
  thumbnail_url,
  distance,
  total_time,
  is_public,
  view_count,
  like_count,
  pins
)
values
  (1, 1, '서울특별시', '마포구', '합정동', '양화로', '[{"lat":37.5494,"lng":126.9139},{"lat":37.5521,"lng":126.9148},{"lat":37.5552,"lng":126.9181}]'::jsonb, '한강 따라 걷기 좋은 날', '채용 담당자가 바로 서비스의 분위기를 느낄 수 있도록 만든 데모 포스트입니다.', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200', 4200, 38, true, 148, 29, '[{"point":{"lat":37.5501,"lng":126.9142},"content":"출발 지점","thumbnailUrl":null},{"point":{"lat":37.5531,"lng":126.9162},"content":"뷰포인트","thumbnailUrl":null}]'::jsonb),
  (2, 2, '서울특별시', '영등포구', '여의도동', '여의동로', '[{"lat":37.5263,"lng":126.9348},{"lat":37.5288,"lng":126.9321},{"lat":37.5322,"lng":126.9304}]'::jsonb, '여의도 벚꽃길 산책', '강변 바람과 넓은 보행로가 좋아 초보자도 걷기 편한 코스예요.', 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=1200', 3600, 32, true, 121, 24, '[{"point":{"lat":37.5281,"lng":126.9331},"content":"벤치가 많은 구간","thumbnailUrl":null}]'::jsonb),
  (3, 3, '서울특별시', '성동구', '성수동', '서울숲길', '[{"lat":37.5445,"lng":127.0374},{"lat":37.5462,"lng":127.0397},{"lat":37.5481,"lng":127.0418}]'::jsonb, '서울숲 그늘 코스', '나무 그늘이 많아 낮에도 걷기 좋고 근처 카페까지 연결돼요.', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200', 2800, 27, true, 96, 18, '[{"point":{"lat":37.546,"lng":127.039},"content":"서울숲 중앙 산책로","thumbnailUrl":null}]'::jsonb),
  (4, 4, '서울특별시', '종로구', '삼청동', '북촌로', '[{"lat":37.5823,"lng":126.9837},{"lat":37.5838,"lng":126.9851},{"lat":37.5854,"lng":126.9868}]'::jsonb, '북촌 골목 마실', '조용한 골목과 한옥 풍경을 천천히 즐길 수 있는 코스입니다.', 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1200', 2100, 25, true, 88, 17, '[{"point":{"lat":37.5842,"lng":126.9855},"content":"사진 찍기 좋은 골목","thumbnailUrl":null}]'::jsonb),
  (5, 5, '서울특별시', '용산구', '이태원동', '녹사평대로', '[{"lat":37.5347,"lng":126.9946},{"lat":37.5364,"lng":126.9972},{"lat":37.5382,"lng":126.9991}]'::jsonb, '남산 보이는 도심길', '도심 분위기와 언덕길이 적당히 섞인 운동감 있는 산책로예요.', 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1200', 3300, 35, true, 75, 15, '[{"point":{"lat":37.5367,"lng":126.9975},"content":"남산이 보이는 지점","thumbnailUrl":null}]'::jsonb),
  (6, 6, '서울특별시', '서초구', '반포동', '반포대로', '[{"lat":37.5065,"lng":126.9946},{"lat":37.5092,"lng":126.9964},{"lat":37.5121,"lng":126.9983}]'::jsonb, '반포 한강 야경길', '해 질 무렵 걷기 좋고 야경을 보기 좋은 구간입니다.', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200', 4600, 42, true, 132, 31, '[{"point":{"lat":37.5101,"lng":126.9971},"content":"야경 포인트","thumbnailUrl":null}]'::jsonb),
  (7, 7, '서울특별시', '서대문구', '연희동', '연희로', '[{"lat":37.5665,"lng":126.9309},{"lat":37.5681,"lng":126.9324},{"lat":37.5697,"lng":126.9342}]'::jsonb, '연희동 카페 골목', '걷다가 쉬어가기 좋은 카페와 작은 가게가 많은 코스입니다.', 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1200', 2500, 29, true, 64, 12, '[{"point":{"lat":37.5682,"lng":126.9328},"content":"카페 밀집 구간","thumbnailUrl":null}]'::jsonb),
  (8, 8, '서울특별시', '송파구', '잠실동', '석촌호수로', '[{"lat":37.5098,"lng":127.1003},{"lat":37.5116,"lng":127.1027},{"lat":37.5131,"lng":127.1054}]'::jsonb, '석촌호수 한 바퀴', '호수를 따라 걷는 평탄한 코스라 누구나 편하게 걸을 수 있어요.', 'https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=1200', 3900, 36, true, 142, 34, '[{"point":{"lat":37.5117,"lng":127.1031},"content":"호수 전망 구간","thumbnailUrl":null}]'::jsonb),
  (9, 9, '서울특별시', '강남구', '삼성동', '봉은사로', '[{"lat":37.5137,"lng":127.0579},{"lat":37.5154,"lng":127.0605},{"lat":37.5173,"lng":127.0632}]'::jsonb, '도심 속 봉은사길', '빌딩 숲 사이에서 잠깐 숨을 고르기 좋은 도심 산책로입니다.', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200', 3100, 33, true, 58, 10, '[{"point":{"lat":37.5156,"lng":127.0607},"content":"조용한 산책 구간","thumbnailUrl":null}]'::jsonb),
  (10, 10, '서울특별시', '마포구', '상암동', '월드컵로', '[{"lat":37.5683,"lng":126.8971},{"lat":37.5705,"lng":126.8992},{"lat":37.5728,"lng":126.9015}]'::jsonb, '하늘공원 오르막길', '조금 힘들지만 정상에서 보이는 풍경이 좋은 코스입니다.', 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200', 5200, 55, true, 117, 27, '[{"point":{"lat":37.571,"lng":126.9},"content":"전망이 트이는 지점","thumbnailUrl":null}]'::jsonb)
on conflict (id) do update set
  user_id = excluded.user_id,
  depth1 = excluded.depth1,
  depth2 = excluded.depth2,
  depth3 = excluded.depth3,
  depth4 = excluded.depth4,
  path = excluded.path,
  title = excluded.title,
  content = excluded.content,
  thumbnail_url = excluded.thumbnail_url,
  distance = excluded.distance,
  total_time = excluded.total_time,
  is_public = excluded.is_public,
  view_count = excluded.view_count,
  like_count = excluded.like_count,
  pins = excluded.pins;

insert into masils (
  id,
  user_id,
  post_id,
  depth1,
  depth2,
  depth3,
  depth4,
  path,
  content,
  thumbnail_url,
  distance,
  total_time,
  calories,
  started_at,
  pins
)
select
  id,
  user_id,
  id,
  depth1,
  depth2,
  depth3,
  depth4,
  path,
  title || ' 기록',
  thumbnail_url,
  distance,
  total_time,
  greatest(80, floor(distance * 0.052)::integer),
  now() - (id || ' days')::interval,
  pins
from posts
where id between 1 and 10
on conflict (id) do update set
  user_id = excluded.user_id,
  post_id = excluded.post_id,
  depth1 = excluded.depth1,
  depth2 = excluded.depth2,
  depth3 = excluded.depth3,
  depth4 = excluded.depth4,
  path = excluded.path,
  content = excluded.content,
  thumbnail_url = excluded.thumbnail_url,
  distance = excluded.distance,
  total_time = excluded.total_time,
  calories = excluded.calories,
  started_at = excluded.started_at,
  pins = excluded.pins;

insert into mates (
  id,
  author_id,
  post_id,
  depth1,
  depth2,
  depth3,
  depth4,
  title,
  content,
  gathering_place_point,
  gathering_place_detail,
  gathering_at,
  capacity,
  status
)
values
  (1, 1, 1, '서울특별시', '마포구', '합정동', '양화로', '일몰 산책 메이트', '주말 저녁에 같이 걷고 이야기 나눌 분을 찾습니다.', '{"lat":37.5498,"lng":126.9146}'::jsonb, '합정역 2번 출구', now() + interval '1 day', 4, 'OPEN'),
  (2, 2, 2, '서울특별시', '영등포구', '여의도동', '여의동로', '퇴근 후 한강 걷기', '가볍게 30분 정도 걸을 분을 찾습니다.', '{"lat":37.5268,"lng":126.9341}'::jsonb, '여의나루역 3번 출구', now() + interval '2 days', 5, 'OPEN'),
  (3, 3, 3, '서울특별시', '성동구', '성수동', '서울숲길', '서울숲 아침 산책', '주말 오전 조용히 걷고 싶은 분 환영해요.', '{"lat":37.5453,"lng":127.0382}'::jsonb, '서울숲역 4번 출구', now() + interval '3 days', 3, 'OPEN'),
  (4, 4, 4, '서울특별시', '종로구', '삼청동', '북촌로', '북촌 사진 산책', '천천히 걷고 사진도 찍는 모임입니다.', '{"lat":37.5832,"lng":126.9848}'::jsonb, '안국역 2번 출구', now() + interval '4 days', 4, 'OPEN'),
  (5, 5, 5, '서울특별시', '용산구', '이태원동', '녹사평대로', '남산 보며 걷기', '조금 빠른 속도로 걷는 산책 메이트를 구해요.', '{"lat":37.5351,"lng":126.9952}'::jsonb, '녹사평역 1번 출구', now() + interval '5 days', 4, 'OPEN'),
  (6, 6, 6, '서울특별시', '서초구', '반포동', '반포대로', '반포 야경 산책', '야경 보며 편하게 걸어요.', '{"lat":37.5072,"lng":126.9953}'::jsonb, '반포한강공원 달빛광장', now() + interval '6 days', 6, 'OPEN'),
  (7, 7, 7, '서울특별시', '서대문구', '연희동', '연희로', '카페 골목 산책', '산책 후 커피 한 잔까지 같이해요.', '{"lat":37.5671,"lng":126.9318}'::jsonb, '연희삼거리 버스정류장', now() + interval '7 days', 3, 'OPEN'),
  (8, 8, 8, '서울특별시', '송파구', '잠실동', '석촌호수로', '석촌호수 저녁 산책', '호수 한 바퀴 천천히 걸을 분을 찾습니다.', '{"lat":37.5108,"lng":127.1018}'::jsonb, '석촌호수 동호 입구', now() + interval '8 days', 5, 'OPEN'),
  (9, 9, 9, '서울특별시', '강남구', '삼성동', '봉은사로', '도심 점심 산책', '점심시간에 짧게 걷는 모임입니다.', '{"lat":37.5145,"lng":127.0592}'::jsonb, '봉은사역 6번 출구', now() + interval '9 days', 4, 'OPEN'),
  (10, 10, 10, '서울특별시', '마포구', '상암동', '월드컵로', '하늘공원 도전 산책', '오르막길도 괜찮은 분 같이 걸어요.', '{"lat":37.569,"lng":126.8982}'::jsonb, '월드컵공원 평화광장', now() + interval '10 days', 4, 'OPEN')
on conflict (id) do update set
  author_id = excluded.author_id,
  post_id = excluded.post_id,
  depth1 = excluded.depth1,
  depth2 = excluded.depth2,
  depth3 = excluded.depth3,
  depth4 = excluded.depth4,
  title = excluded.title,
  content = excluded.content,
  gathering_place_point = excluded.gathering_place_point,
  gathering_place_detail = excluded.gathering_place_detail,
  gathering_at = excluded.gathering_at,
  capacity = excluded.capacity,
  status = excluded.status;

insert into mate_participants (id, user_id, mate_id, message, status)
values
  (1, 2, 1, '함께 걸어요!', 'ACCEPTED'),
  (2, 3, 1, '저도 참여하고 싶어요.', 'REQUESTED'),
  (3, 4, 2, '퇴근 후 가능합니다.', 'ACCEPTED'),
  (4, 5, 3, '아침 산책 좋아요.', 'REQUESTED'),
  (5, 6, 4, '사진 찍으면서 걸어요.', 'ACCEPTED'),
  (6, 7, 5, '빠른 산책 가능합니다.', 'REQUESTED'),
  (7, 8, 6, '야경 산책 같이해요.', 'ACCEPTED'),
  (8, 9, 7, '커피까지 좋아요.', 'REQUESTED'),
  (9, 10, 8, '석촌호수 자주 걸어요.', 'ACCEPTED'),
  (10, 1, 10, '하늘공원 같이 가요.', 'REQUESTED')
on conflict (id) do update set
  user_id = excluded.user_id,
  mate_id = excluded.mate_id,
  message = excluded.message,
  status = excluded.status;

select setval('users_id_seq', (select max(id) from users));
select setval('posts_id_seq', (select max(id) from posts));
select setval('masils_id_seq', (select max(id) from masils));
select setval('mates_id_seq', (select max(id) from mates));
select setval('mate_participants_id_seq', (select max(id) from mate_participants));
