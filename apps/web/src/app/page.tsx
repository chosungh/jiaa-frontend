"use client";

import { useEffect, useState, useRef } from "react";
import "./landing.css";

export default function Home() {
  const [os, setOs] = useState<"mac" | "windows" | "unknown">("unknown");
  const featuresSectionRef = useRef<HTMLElement>(null);
  const sectionTitleRef = useRef<HTMLHeadingElement>(null);
  const featureCardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.includes("mac")) {
      setOs("mac");
    } else if (userAgent.includes("win")) {
      setOs("windows");
    }
  }, []);

  // Scroll animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");

            // Also animate child feature cards
            if (entry.target.classList.contains("feature-grid")) {
              const cards = entry.target.querySelectorAll(".feature-card");
              cards.forEach((card) => card.classList.add("animate"));
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    // Observe section title
    if (sectionTitleRef.current) {
      observer.observe(sectionTitleRef.current);
    }

    // Observe feature cards container
    if (featureCardsRef.current) {
      observer.observe(featureCardsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const getDownloadText = () => {
    if (os === "mac") return "macOS용 다운로드";
    if (os === "windows") return "Windows용 다운로드";
    return "다운로드";
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <h1 className="hero-title">
            <span className="gradient-text">차세대</span> AI 아바타
          </h1>
          <p className="hero-subtitle">
            나만의 AI 아바타와 함께하는 새로운 데스크톱 경험을 만나보세요.<br />
            생산성, 엔터테인먼트, 그리고 어시스턴트까지, 모든 것을 한 곳에서.
          </p>
          <div className="hero-cta">
            <button className="button-primary">{getDownloadText()}</button>
            <button className="button-secondary">더 알아보기</button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" ref={featuresSectionRef}>
        <div className="container">
          <h2 className="section-title" ref={sectionTitleRef}>주요 기능</h2>
          <div className="feature-grid" ref={featureCardsRef}>
            <div className="feature-card">
              <h3>Live2D 아바타</h3>
              <p>반응형 인터랙션으로 생동감 넘치는 캐릭터와 소통하세요.</p>
            </div>
            <div className="feature-card">
              <h3>스마트 대시보드</h3>
              <p>통합 대시보드로 생산성을 관리하고 인사이트를 얻으세요.</p>
            </div>
            <div className="feature-card">
              <h3>철저한 보안과 프라이버시</h3>
              <p>사용자의 데이터는 안전하게 보호됩니다. 프라이버시 중심 설계.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-links">
            <a href="/terms">이용약관</a>
            <a href="/privacy">개인정보처리방침</a>
          </div>
          <p>&copy; 2025 Jiwon Tech Innovation. All rights reserved.</p>
        </div>
      </footer>


    </div>
  );
}

