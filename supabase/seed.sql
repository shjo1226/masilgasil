insert into users (id, nickname, sex, birth_date, height, weight, exercise_intensity, profile_img, total_distance, total_count, total_calories, is_public, provider, social_id)
values
  (1, '마실가실', 'FEMALE', '1998-06-01', 167, 58, 'NORMAL', '/images/userProfile.svg', 12430, 16, 840, true, 'kakao', 'mock-kakao-1')
on conflict (id) do nothing;

insert into posts (id, user_id, depth1, depth2, depth3, depth4, path, title, content, thumbnail_url, distance, total_time, is_public, view_count, like_count, pins)
values
  (
    1,
    1,
    '서울특별시',
    '마포구',
    '합정동',
    '양화로',
    '[{"lat":37.5494,"lng":126.9139},{"lat":37.5521,"lng":126.9148},{"lat":37.5552,"lng":126.9181}]'::jsonb,
    '한강 따라 걷기 좋은 날',
    '채용 담당자가 바로 서비스의 분위기를 느낄 수 있도록 만든 데모 포스트입니다.',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200',
    4200,
    38,
    true,
    48,
    9,
    '[{"point":{"lat":37.5501,"lng":126.9142},"content":"출발 지점","thumbnailUrl":null},{"point":{"lat":37.5531,"lng":126.9162},"content":"뷰포인트","thumbnailUrl":null}]'::jsonb
  )
on conflict (id) do nothing;

insert into masils (id, user_id, post_id, depth1, depth2, depth3, depth4, path, content, thumbnail_url, distance, total_time, calories, started_at, pins)
values
  (
    1,
    1,
    1,
    '서울특별시',
    '마포구',
    '합정동',
    '양화로',
    '[{"lat":37.5494,"lng":126.9139},{"lat":37.5521,"lng":126.9148},{"lat":37.5552,"lng":126.9181}]'::jsonb,
    '기록용 마실 코스입니다.',
    'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1200',
    4200,
    38,
    214,
    now(),
    '[{"point":{"lat":37.5501,"lng":126.9142},"content":"출발","thumbnailUrl":null}]'::jsonb
  )
on conflict (id) do nothing;

insert into mates (id, author_id, post_id, depth1, depth2, depth3, depth4, title, content, gathering_place_point, gathering_place_detail, gathering_at, capacity, status)
values
  (
    1,
    1,
    1,
    '서울특별시',
    '마포구',
    '합정동',
    '양화로',
    '일몰 산책 메이트',
    '주말 저녁에 같이 걷고 이야기 나눌 분을 찾습니다.',
    '{"lat":37.5498,"lng":126.9146}'::jsonb,
    '합정역 2번 출구',
    now() + interval '1 day',
    4,
    'OPEN'
  )
on conflict (id) do nothing;

insert into mate_participants (id, user_id, mate_id, message, status)
values
  (1, 1, 1, '함께 걸어요!', 'ACCEPTED')
on conflict (id) do nothing;
