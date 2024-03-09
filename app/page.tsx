"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex-column-center-center">
      This is the homepage
      <div className="title">Welcome to preda.</div>
      <div className="link">
        <Link href="/lab">Click here for the laboratory</Link>
      </div>
      <div className="link">
        <Link href="/gallery">Click here for the gallery</Link>
      </div>
      <div className="link">
        <Link href="/profile">Click here for the profile</Link>
      </div>
    </div>
  );
}
