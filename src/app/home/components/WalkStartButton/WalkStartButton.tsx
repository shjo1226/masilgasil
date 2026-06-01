"use client";

// TODO - 추후 모든 Tailwind 마이그레이션 작업후 use client 제거
import { Button } from "@/components";

import Link from "next/link";

const WalkStartButton = () => {
  return (
    <Link href="/log/record">
      <Button
        variant="neumorp"
        buttonColor="#81BB26"
        textColor="#FFFFFF"
        width="calc(100% - 3rem)"
        style={{
          position: "fixed",
          left: "50%",
          bottom: "9.5rem",
          transform: "translateX(-50%)",
          maxWidth: `57rem`,
          height: "6rem",
          fontSize: "1.8rem",
          fontWeight: "700",
          zIndex: "30",
        }}
      >
        산책하기
      </Button>
    </Link>
  );
};

export default WalkStartButton;
