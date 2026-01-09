"use client";

const clouds = [1, 2, 3];

export default function UnderConstructionComponent() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-b from-[#0e1117] via-[#121826] to-[#0c0f17] text-white'>
      <div className='relative flex h-[460px] w-[460px] items-center justify-center overflow-hidden rounded-3xl shadow-[0_25px_65px_rgba(0,0,0,0.4)]'>
        <div className='absolute inset-0 bg-gradient-to-b from-[#1b2435] via-[#1f2c44] to-[#1a2334]' />

        <div className='absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_20%_20%,rgba(255,193,94,0.08),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(95,201,255,0.08),transparent_32%),radial-gradient(circle_at_60%_70%,rgba(255,134,134,0.08),transparent_36%)]' />

        <div className='absolute top-6 left-1/2 -translate-x-1/2 text-center text-3xl font-extrabold tracking-[0.18em] text-[#ffd166] drop-shadow-[0_3px_6px_rgba(0,0,0,0.35)] z-40'>
          Under Construction
        </div>

        <div className='w-full absolute bottom-10 left-1/2 -translate-x-1/2 text-center text-md font-semibold text-[#dfe0e3] drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] z-40'>
          Cool things are being built, be sure to check back soon!
        </div>

        <div className='absolute inset-0' aria-hidden>
          {clouds.map((cloud) => (
            <div key={cloud} className={`cloud cloud-${cloud}`} />
          ))}

          <div className='sun' />

          <div className='crane'>
            <div className='tower'>
              <div className='tower-gap gap-1' />
              <div className='tower-gap gap-2' />
              <div className='tower-gap gap-3' />
            </div>
            <div className='arm'>
              <div className='arm-beam' />
              <div className='trolley'>
                <div className='trolley-cabin' />
                <div className='cable' />
                <div className='hook'>
                  <div className='load' />
                </div>
              </div>
              <div className='counterweight' />
            </div>
            <div className='base' />
          </div>

          <div className='building'>
            <div className='floor floor-1 z-30' />
            <div className='floor floor-2' />
            <div className='floor floor-3' />
            <div className='column column-1 z-30' />
            <div className='column column-2' />
            <div className='column column-3 z-30' />
            <div className='rebar rebar-1' />
            <div className='rebar rebar-2' />
            <div className='rebar rebar-3' />
            <div className='elevator'>
              <div className='elevator-cage' />
            </div>
          </div>

          <div className='excavator z-30'>
            <div className='excavator-body'>
              <div className='cab' />
              <div className='tracks'>
                <div className='track' />
                <div className='track track-2' />
              </div>
              <div className='boom'>
                <div className='stick'>
                  <div className='bucket' />
                </div>
              </div>
            </div>
          </div>

          <div className='truck z-50'>
            <div className='truck-bed'>
              <div className='beam-stack' />
            </div>
            <div className='truck-cab'>
              <div className='window' />
              <div className='headlight' />
            </div>
            <div className='wheel wheel-back' />
            <div className='wheel wheel-front' />
          </div>

          <div className='ground z-10'>
            <div className='striping striping-1' />
            <div className='striping striping-2' />
            <div className='striping striping-3' />
          </div>

          <div className='sparks'>
            <span className='spark spark-1' />
            <span className='spark spark-2' />
            <span className='spark spark-3' />
          </div>
        </div>
      </div>
      <style jsx>{`
        .cloud {
          position: absolute;
          width: 120px;
          height: 60px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 50px;
          filter: blur(0.5px);
          animation: float 22s linear infinite;
        }
        .cloud::before,
        .cloud::after {
          content: "";
          position: absolute;
          background: rgba(255, 255, 255, 0.15);
          width: 70px;
          height: 70px;
          border-radius: 50%;
          top: -20px;
        }
        .cloud::before {
          left: 10px;
        }
        .cloud::after {
          left: 45px;
          width: 90px;
          height: 90px;
          top: -35px;
        }
        .cloud-1 {
          top: 70px;
          left: -180px;
          animation-delay: 0s;
        }
        .cloud-2 {
          top: 120px;
          left: -360px;
          animation-delay: -6s;
        }
        .cloud-3 {
          top: 40px;
          left: -520px;
          animation-delay: -12s;
        }

        .sun {
          position: absolute;
          top: 38px;
          right: 60px;
          width: 62px;
          height: 62px;
          background: radial-gradient(
            circle at 30% 30%,
            #ffe39f,
            #ffbd59 65%,
            #f79f1f 100%
          );
          border-radius: 50%;
          box-shadow: 0 0 25px rgba(255, 200, 120, 0.45);
          animation: pulse 6s ease-in-out infinite;
        }

        .crane {
          position: absolute;
          left: 50px;
          bottom: 150px;
          width: 260px;
          height: 220px;
        }
        .tower {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 42px;
          height: 190px;
          background: linear-gradient(180deg, #2f3b55 0%, #101725 100%);
          clip-path: polygon(0 0, 100% 4%, 85% 100%, 15% 100%);
          overflow: hidden;
        }
        .tower-gap {
          position: absolute;
          left: 8px;
          width: 26px;
          height: 32px;
          border: 2px solid rgba(255, 209, 102, 0.5);
          border-radius: 6px;
        }
        .tower-gap.gap-1 {
          bottom: 18px;
        }
        .tower-gap.gap-2 {
          bottom: 62px;
        }
        .tower-gap.gap-3 {
          bottom: 106px;
        }

        .arm {
          position: absolute;
          left: 30px;
          top: 30px;
          width: 230px;
          height: 14px;
        }
        .arm-beam {
          position: absolute;
          top: 0;
          left: 0;
          width: 210px;
          height: 14px;
          background: linear-gradient(90deg, #ffce59 0%, #f9a826 100%);
          border-radius: 10px;
          box-shadow: 0 5px 18px rgba(0, 0, 0, 0.25);
        }
        .counterweight {
          position: absolute;
          right: 0;
          top: -10px;
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #4b556b, #30384d);
          border-radius: 10px;
          box-shadow: inset 0 0 6px rgba(255, 255, 255, 0.08);
        }
        .trolley {
          position: absolute;
          left: 12px;
          top: -10px;
          width: 48px;
          height: 34px;
          animation: trolley-slide 8s ease-in-out infinite;
        }
        .trolley-cabin {
          position: absolute;
          width: 100%;
          height: 100%;
          background: linear-gradient(145deg, #ffb347, #f7991d);
          border-radius: 8px;
          box-shadow: 0 6px 14px rgba(0, 0, 0, 0.25);
        }
        .cable {
          position: absolute;
          left: 50%;
          top: 32px;
          width: 3px;
          height: 95px;
          background: linear-gradient(
            180deg,
            rgba(255, 209, 102, 0.75),
            rgba(255, 169, 58, 0.95)
          );
          transform-origin: top center;
          animation: hook-sway 3s ease-in-out infinite;
        }
        .hook {
          position: absolute;
          left: 50%;
          top: 120px;
          width: 22px;
          height: 36px;
          margin-left: -11px;
          background: linear-gradient(180deg, #111826, #23304a);
          border-radius: 0 0 12px 12px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.35);
          animation: hook-bob 3s ease-in-out infinite;
        }
        .load {
          position: absolute;
          left: 50%;
          bottom: -18px;
          width: 64px;
          height: 18px;
          margin-left: -32px;
          background: linear-gradient(90deg, #cfd6e5 0%, #9bb3ce 100%);
          border-radius: 5px;
          transform-origin: center;
          animation: load-swing 3s ease-in-out infinite;
        }

        .building {
          position: absolute;
          bottom: 110px;
          right: 46px;
          width: 190px;
          height: 180px;
        }
        .floor {
          position: absolute;
          left: 0;
          width: 100%;
          height: 16px;
          background: linear-gradient(90deg, #5f718f, #2f3b55);
          border-radius: 10px;
          box-shadow: inset 0 4px 10px rgba(255, 255, 255, 0.08);
        }
        .floor-1 {
          bottom: 0;
        }
        .floor-2 {
          bottom: 60px;
          /* animation: slab-lift 6s ease-in-out infinite; */
        }
        .floor-3 {
          bottom: 120px;
          opacity: 0.8;
          /* animation: slab-lift 6s ease-in-out infinite reverse; */
        }
        .column {
          position: absolute;
          width: 20px;
          height: 120px;
          background: linear-gradient(180deg, #cfd6e5, #96a8c3);
          border-radius: 8px;
          bottom: 16px;
          box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.2);
          /* animation: column-rise 10s linear infinite; */
        }
        .column-1 {
          left: 12px;
          /* animation-delay: 0s; */
        }
        .column-2 {
          left: 84px;
          /* animation-delay: -3s; */
        }
        .column-3 {
          left: 156px;
          /* animation-delay: -6s; */
        }
        .rebar {
          position: absolute;
          bottom: 134px;
          width: 6px;
          height: 30px;
          background: linear-gradient(180deg, #7c8da8, #405068);
          border-radius: 6px;
        }
        .rebar-1 {
          left: 28px;
        }
        .rebar-2 {
          left: 100px;
        }
        .rebar-3 {
          left: 172px;
        }
        .elevator {
          position: absolute;
          left: 70px;
          bottom: 0;
          width: 50px;
          height: 140px;
          border-radius: 12px;
          overflow: hidden;
          background: linear-gradient(
            180deg,
            rgba(15, 20, 33, 0.7),
            rgba(7, 10, 16, 0.6)
          );
          border: 2px solid rgba(255, 209, 102, 0.3);
        }
        .elevator-cage {
          position: absolute;
          left: 6px;
          width: 38px;
          height: 38px;
          background: linear-gradient(135deg, #ffb347, #f7991d);
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
          animation: lift-move 5s ease-in-out infinite;
        }

        .excavator {
          position: absolute;
          bottom: 60px;
          left: 180px;
          width: 160px;
          height: 120px;
          /* animation: excavator-bob 2.6s ease-in-out infinite; */
        }
        .excavator-body {
          position: absolute;
          bottom: 24px;
          left: 10px;
          width: 140px;
          height: 64px;
          background: linear-gradient(135deg, #ffb347, #f8931d);
          border-radius: 16px;
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.3);
        }
        .cab {
          position: absolute;
          right: 8px;
          top: 8px;
          width: 42px;
          height: 32px;
          background: linear-gradient(145deg, #c8e7ff, #7fb1e3);
          border-radius: 10px;
        }
        .tracks {
          position: absolute;
          bottom: -18px;
          left: 0;
          width: 140px;
          height: 32px;
          background: linear-gradient(180deg, #1c2433, #0c1019);
          border-radius: 12px;
          box-shadow: inset 0 0 8px rgba(255, 255, 255, 0.08);
        }
        .track {
          position: absolute;
          left: 10px;
          top: 6px;
          width: 36px;
          height: 20px;
          background: radial-gradient(circle at 30% 30%, #6d7a91, #222a38 70%);
          border-radius: 10px;
          box-shadow: 0 0 0 4px #0b0f19;
          animation: wheel-spin 2s linear infinite;
        }
        .track-2 {
          left: 84px;
        }
        .boom {
          position: absolute;
          left: -12px;
          top: -10px;
          width: 70px;
          height: 16px;
          background: linear-gradient(90deg, #ffce59, #f9a826);
          border-radius: 10px;
          transform-origin: 80% 50%;
          animation: boom-swing 3.8s ease-in-out infinite;
        }
        .stick {
          position: absolute;
          right: -50px;
          top: 0;
          width: 70px;
          height: 14px;
          background: linear-gradient(90deg, #ffce59, #f9a826);
          border-radius: 10px;
          transform-origin: 10% 50%;
          /* animation: stick-swing 3.8s ease-in-out infinite; */
        }
        .bucket {
          position: absolute;
          right: -18px;
          top: -6px;
          width: 34px;
          height: 26px;
          background: linear-gradient(135deg, #cfd6e5, #8ba3c4);
          border-radius: 8px 8px 10px 10px;
          transform-origin: left center;
          animation: bucket-scoop 3.8s ease-in-out infinite;
        }

        .base {
          position: absolute;
          left: 6px;
          bottom: -10px;
          width: 72px;
          height: 22px;
          background: linear-gradient(180deg, #111826, #0a0f18);
          border-radius: 10px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
        }

        .truck {
          position: absolute;
          bottom: 65px;
          left: 520px;
          width: 180px;
          height: 70px;
          animation: truck-drive 9s linear infinite;
        }
        .truck-bed {
          position: absolute;
          left: 34px;
          top: 14px;
          width: 124px;
          height: 44px;
          background: linear-gradient(180deg, #1f2738, #0f1421);
          border-radius: 10px 10px 6px 6px;
          box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.04);
        }
        .beam-stack {
          position: absolute;
          left: 10px;
          top: 6px;
          width: 100px;
          height: 12px;
          background: linear-gradient(90deg, #b9c6d9, #8ba3c4);
          box-shadow: 0 10px 0 0 #8ba3c4, 0 20px 0 0 #566c8c;
          border-radius: 4px;
        }
        .truck-cab {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 56px;
          height: 54px;
          background: linear-gradient(135deg, #ffb347, #f8931d);
          border-radius: 12px;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
        }
        .window {
          position: absolute;
          right: 8px;
          top: 8px;
          width: 26px;
          height: 18px;
          background: linear-gradient(135deg, #c8e7ff, #7fb1e3);
          border-radius: 6px;
        }
        .headlight {
          position: absolute;
          right: -6px;
          bottom: 12px;
          width: 10px;
          height: 12px;
          background: radial-gradient(circle, #fffae3 30%, #ffc857 100%);
          border-radius: 4px;
          box-shadow: 0 0 12px rgba(255, 200, 87, 0.75);
        }
        .wheel {
          position: absolute;
          bottom: -10px;
          width: 28px;
          height: 28px;
          background: radial-gradient(circle at 30% 30%, #6d7a91, #222a38 70%);
          border-radius: 50%;
          box-shadow: 0 0 0 4px #0b0f19;
          animation: wheel-spin 1s linear infinite;
        }
        .wheel-back {
          left: 60px;
        }
        .wheel-front {
          left: 120px;
        }

        .ground {
          position: absolute;
          bottom: 0px;
          left: -20px;
          width: calc(100% + 20px);
          height: 90px;
          background: linear-gradient(180deg, #0f1421 0%, #080b12 100%);
          box-shadow: inset 0 12px 20px rgba(255, 255, 255, 0.02);
          overflow: hidden;
        }
        .striping {
          position: absolute;
          bottom: 26px;
          width: 160px;
          height: 12px;
          background: repeating-linear-gradient(
            90deg,
            #f9a826 0,
            #f9a826 26px,
            #101725 26px,
            #101725 40px
          );
          opacity: 0.8;
          /* animation: stripes-move 4s linear infinite; */
        }
        .striping-1 {
          left: -40px;
          animation-delay: 0s;
        }
        .striping-2 {
          left: 140px;
          animation-delay: -1.2s;
        }
        .striping-3 {
          left: 320px;
          animation-delay: -2.4s;
        }

        .sparks {
          position: absolute;
          bottom: 114px;
          left: 240px;
        }
        .spark {
          position: absolute;
          width: 10px;
          height: 10px;
          background: radial-gradient(circle, #ffe9b0 20%, #ffaf45 70%);
          border-radius: 50%;
          opacity: 0;
          animation: spark-pop 1.2s ease-in-out infinite;
        }
        .spark-1 {
          left: 0;
          animation-delay: 0s;
        }
        .spark-2 {
          left: 16px;
          animation-delay: 0.3s;
        }
        .spark-3 {
          left: 32px;
          animation-delay: 0.6s;
        }

        @keyframes float {
          0% {
            transform: translateX(0);
            opacity: 0.9;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(760px);
            opacity: 0.9;
          }
        }
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            filter: drop-shadow(0 0 6px rgba(255, 200, 120, 0.55));
          }
          50% {
            transform: scale(1.04);
            filter: drop-shadow(0 0 16px rgba(255, 200, 120, 0.75));
          }
        }
        @keyframes trolley-slide {
          0% {
            transform: translateX(0);
          }
          35% {
            transform: translateX(110px);
          }
          50% {
            transform: translateX(110px);
          }
          85% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(0);
          }
        }
        @keyframes hook-sway {
          0%,
          100% {
            transform: rotate(-4deg);
          }
          50% {
            transform: rotate(4deg);
          }
        }
        @keyframes hook-bob {
          0%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(12px);
          }
          60% {
            transform: translateY(4px);
          }
        }
        @keyframes load-swing {
          0%,
          100% {
            transform: rotate(-3deg);
          }
          40% {
            transform: rotate(6deg);
          }
          60% {
            transform: rotate(1deg);
          }
        }
        @keyframes truck-drive {
          0% {
            transform: translateX(540px);
          }
          100% {
            transform: translateX(-660px);
          }
        }
        @keyframes wheel-spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes stripes-move {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-200px);
          }
        }
        @keyframes spark-pop {
          0% {
            transform: translateY(0) scale(0.4);
            opacity: 0;
          }
          25% {
            opacity: 1;
          }
          50% {
            transform: translateY(-16px) scale(1);
            opacity: 0.9;
          }
          100% {
            transform: translateY(-30px) scale(0.6);
            opacity: 0;
          }
        }

        @keyframes slab-lift {
          0%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-8px);
          }
          60% {
            transform: translateY(-3px);
          }
        }
        @keyframes column-rise {
          0% {
            transform: scaleY(0.7);
            opacity: 0.7;
          }
          50% {
            transform: scaleY(1);
            opacity: 1;
          }
          100% {
            transform: scaleY(0.7);
            opacity: 0.7;
          }
        }
        @keyframes lift-move {
          0% {
            bottom: 0;
          }
          50% {
            bottom: 92px;
          }
          100% {
            bottom: 0;
          }
        }
        @keyframes excavator-bob {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        @keyframes boom-swing {
          0%,
          100% {
            transform: rotate(-6deg);
          }
          50% {
            transform: rotate(6deg);
          }
        }
        @keyframes stick-swing {
          0%,
          100% {
            transform: rotate(12deg);
          }
          50% {
            transform: rotate(-4deg);
          }
        }
        @keyframes bucket-scoop {
          0%,
          100% {
            transform: rotate(12deg);
          }
          50% {
            transform: rotate(-16deg);
          }
        }
      `}</style>
    </div>
  );
}
