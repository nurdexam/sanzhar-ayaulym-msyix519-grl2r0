"use client";

import {
  Canvas,
  useFrame,
} from "@react-three/fiber";

import {
  Environment,
  Float,
  Sparkles,
  MeshTransmissionMaterial,
  PerspectiveCamera,
} from "@react-three/drei";

import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
} from "framer-motion";

import {
  ArrowDown,
  ArrowRight,
  CalendarBlank,
  Check,
  Clock,
  Heart,
  MapPin,
  MusicNotes,
  Pause,
  Sparkle,
  StarFour,
  UsersThree,
} from "@phosphor-icons/react";

import Image from "next/image";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import * as THREE from "three";

import type { InvitationData } from "@/types/invitation";

/* =========================================================
   TYPES
========================================================= */

interface Props {
  data: InvitationData;
}

/* =========================================================
   MAIN
========================================================= */

export default function Premium3DInvitation({
  data,
}: Props) {
  const heroRef = useRef<HTMLElement>(null);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [name, setName] = useState("");
  const [guests, setGuests] = useState(1);
  const [attending, setAttending] =
    useState<boolean | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  /* =======================================================
     SCROLL
  ======================================================= */

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: [
      "start start",
      "end start",
    ],
  });

  const cameraY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -100]
  );

  const heroScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, 1.18]
  );

  const heroRotate = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -2]
  );

  /* =======================================================
     COUNTDOWN
  ======================================================= */

  useEffect(() => {
    const target = new Date(
      data.dateTime
    ).getTime();

    const update = () => {
      const diff =
        target - Date.now();

      if (diff <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });

        return;
      }

      setTimeLeft({
        days: Math.floor(
          diff /
            (1000 * 60 * 60 * 24)
        ),

        hours: Math.floor(
          (diff /
            (1000 * 60 * 60)) %
            24
        ),

        minutes: Math.floor(
          (diff /
            (1000 * 60)) %
            60
        ),

        seconds: Math.floor(
          (diff / 1000) % 60
        ),
      });
    };

    update();

    const interval =
      setInterval(update, 1000);

    return () =>
      clearInterval(interval);
  }, [data.dateTime]);

  /* =======================================================
     MUSIC
  ======================================================= */

  const toggleMusic = () => {
    const audio =
      document.getElementById(
        "premium-3d-music"
      ) as HTMLAudioElement | null;

    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    audio
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch(() => {
        console.log(
          "Музыканы ойнату мүмкін болмады."
        );
      });
  };

  /* =======================================================
     RSVP
  ======================================================= */

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!name.trim()) {
      setMessage(
        "Аты-жөніңізді енгізіңіз"
      );

      return;
    }

    if (attending === null) {
      setMessage(
        "Жауабыңызды таңдаңыз"
      );

      return;
    }

    if (!data.clientEmail) {
      setMessage(
        "Email табылмады"
      );

      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response =
        await fetch("/api/rsvp", {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            clientEmail:
              data.clientEmail,

            name: name.trim(),

            guests,

            attending,
          }),
        });

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Қате орын алды"
        );
      }

      setMessage(
        "Рақмет! Жауабыңыз қабылданды ❤️"
      );

      setName("");
      setGuests(1);
      setAttending(null);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Жауапты жіберу мүмкін болмады"
      );
    } finally {
      setLoading(false);
    }
  }

  const events =
    data.events ?? [];

  return (
    <main
      className="
        min-h-screen
        overflow-hidden
        bg-[#050505]
        text-white
      "
    >

      {/* ===================================================
          AUDIO
      =================================================== */}

      <audio
        id="premium-3d-music"
        loop
        preload="metadata"
      >
        <source
          src="/music/toy.mp3"
          type="audio/mpeg"
        />
      </audio>

      {/* ===================================================
          MUSIC BUTTON
      =================================================== */}

      <motion.button
        type="button"
        onClick={toggleMusic}
        whileHover={{
          scale: 1.08,
          rotate: 8,
        }}
        whileTap={{
          scale: 0.9,
        }}
        className="
          fixed
          right-5
          top-5
          z-[100]
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-full
          border
          border-[#d1a74e]/50
          bg-black/50
          text-[#e0bb69]
          shadow-[0_0_50px_rgba(210,165,70,0.15)]
          backdrop-blur-xl
        "
      >
        {isPlaying ? (
          <Pause
            size={19}
            weight="bold"
          />
        ) : (
          <MusicNotes
            size={19}
            weight="bold"
          />
        )}

        {isPlaying && (
          <span
            className="
              absolute
              inset-0
              rounded-full
              border
              border-[#d1a74e]/40
              animate-ping
            "
          />
        )}
      </motion.button>

      {/* ===================================================
          HERO
      =================================================== */}

      <section
        ref={heroRef}
        className="
          relative
          flex
          min-h-[100svh]
          items-center
          justify-center
          overflow-hidden
          bg-[#020202]
          [perspective:1800px]
        "
      >

        {/* 3D BACKGROUND */}

        <div className="absolute inset-0">
          <ThreeDWorld />
        </div>

        {/* COVER */}

        <motion.div
          style={{
            scale: heroScale,
            y: cameraY,
            rotateX: heroRotate,
          }}
          className="
            pointer-events-none
            absolute
            inset-0
            z-[2]
          "
        >

          {data.coverImage && (
            <Image
              src={data.coverImage}
              alt={`${data.groom} мен ${data.bride}`}
              fill
              priority
              sizes="100vw"
              className="
                object-cover
                opacity-[0.16]
                mix-blend-screen
              "
            />
          )}

          <div
            className="
              absolute
              inset-0
              bg-[radial-gradient(circle_at_center,rgba(200,155,70,0.13),transparent_45%)]
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-b
              from-black
              via-black/20
              to-black
            "
          />

        </motion.div>

        {/* HERO CONTENT */}

        <motion.div
          initial={{
            opacity: 0,
            y: 80,
            rotateX: 18,
          }}
          animate={{
            opacity: 1,
            y: 0,
            rotateX: 0,
          }}
          transition={{
            duration: 1.5,
            ease: [
              0.16,
              1,
              0.3,
              1,
            ],
          }}
          className="
            relative
            z-20
            w-full
            px-6
            text-center
            [transform-style:preserve-3d]
          "
        >

          {/* TOP ORNAMENT */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0,
              rotate: -180,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 0,
            }}
            transition={{
              delay: 0.25,
              duration: 1,
            }}
            className="
              mx-auto
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              border
              border-[#d0a64c]/50
              bg-black/30
              text-[#d8ae59]
              shadow-[0_0_70px_rgba(210,165,70,0.18)]
              backdrop-blur-md
              [transform:translateZ(150px)]
            "
          >
            <Heart
              size={28}
              weight="thin"
            />
          </motion.div>

          {/* EYEBROW */}

          <motion.p
            initial={{
              opacity: 0,
              letterSpacing: "0em",
            }}
            animate={{
              opacity: 1,
              letterSpacing:
                "0.18em",
            }}
            transition={{
              delay: 0.55,
              duration: 1,
            }}
            className="
              mt-8
              font-readable
              text-[10px]
              uppercase
              text-[#d2aa58]
            "
          >
            ҚҰРМЕТТІ АҒАЙЫН-ТУЫС,
            ДОС-ЖАРАН!
          </motion.p>

          {/* NAMES */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
              z: -100,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              z: 0,
            }}
            transition={{
              delay: 0.7,
              duration: 1.3,
              ease: [
                0.16,
                1,
                0.3,
                1,
              ],
            }}
            className="
              mt-12
              [transform-style:preserve-3d]
              [transform:translateZ(110px)]
            "
          >

            <h1
              className="
                font-wedding
                text-6xl
                leading-[0.82]
                text-white
                drop-shadow-[0_15px_45px_rgba(255,255,255,0.12)]
                sm:text-8xl
                md:text-[9rem]
              "
            >
              {data.groom}
            </h1>

            <motion.div
              animate={{
                rotate: [
                  -5,
                  5,
                  -5,
                ],
                scale: [
                  1,
                  1.08,
                  1,
                ],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="
                my-6
                font-wedding
                text-4xl
                text-[#d7ad56]
                drop-shadow-[0_0_30px_rgba(215,173,86,0.5)]
              "
            >
              &
            </motion.div>

            <h1
              className="
                font-wedding
                text-6xl
                leading-[0.82]
                text-white
                drop-shadow-[0_15px_45px_rgba(255,255,255,0.12)]
                sm:text-8xl
                md:text-[9rem]
              "
            >
              {data.bride}
            </h1>

          </motion.div>

          {/* INVITATION */}

          <motion.h2
            initial={{
              opacity: 0,
              y: 40,
              rotateX: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
              rotateX: 0,
            }}
            transition={{
              delay: 1.15,
              duration: 1,
            }}
            className="
              mx-auto
              mt-12
              max-w-4xl
              font-wedding
              text-4xl
              leading-[1.25]
              text-white
              drop-shadow-[0_20px_50px_rgba(0,0,0,0.7)]
              sm:text-6xl
              [transform:translateZ(70px)]
            "
          >
            Қуанышымызды
            бөлісуге
            <br />
            шақырамыз
          </motion.h2>

          {/* DATE */}

          <motion.div
            initial={{
              opacity: 0,
              scaleX: 0,
            }}
            animate={{
              opacity: 1,
              scaleX: 1,
            }}
            transition={{
              delay: 1.45,
              duration: 0.9,
            }}
            className="
              mx-auto
              mt-10
              flex
              max-w-md
              items-center
              gap-5
            "
          >

            <span className="h-px flex-1 bg-[#d2a855]/30" />

            <span
              className="
                font-readable
                text-xs
                tracking-[0.2em]
                text-[#d8b363]
              "
            >
              {data.date}
            </span>

            <span className="h-px flex-1 bg-[#d2a855]/30" />

          </motion.div>

        </motion.div>

        {/* SCROLL */}

        <motion.div
          animate={{
            y: [
              0,
              12,
              0,
            ],
            opacity: [
              0.4,
              1,
              0.4,
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="
            absolute
            bottom-8
            left-1/2
            z-30
            -translate-x-1/2
            text-[#d0a552]
          "
        >
          <ArrowDown
            size={20}
            weight="thin"
          />
        </motion.div>

      </section>

      {/* ===================================================
          INTRO 3D
      =================================================== */}

      <section
        className="
          relative
          overflow-hidden
          bg-[#050505]
          px-6
          py-40
          [perspective:1400px]
        "
      >

        <Section3DBackground />

        <motion.div
          initial={{
            opacity: 0,
            y: 80,
            rotateX: 15,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            rotateX: 0,
          }}
          viewport={{
            once: true,
            margin: "-120px",
          }}
          transition={{
            duration: 1.2,
          }}
          className="
            relative
            z-10
            mx-auto
            max-w-4xl
            text-center
            [transform-style:preserve-3d]
          "
        >

          <ThreeDIcon>
            <Heart
              size={28}
              weight="thin"
            />
          </ThreeDIcon>

          <p className="
            mt-10
            font-readable
            text-[10px]
            tracking-[0.3em]
            text-[#bd9345]
          ">
            АҚ НИЕТПЕН
          </p>

          <h2
            className="
              mt-8
              font-wedding
              text-4xl
              leading-[1.35]
              sm:text-6xl
              [transform:translateZ(80px)]
            "
          >
            Сіздерді өміріміздегі
            <br />
            ең бақытты күнге
            <br />
            шақырамыз
          </h2>

          <p
            className="
              mx-auto
              mt-10
              max-w-2xl
              font-readable
              text-sm
              leading-8
              text-white/40
              [transform:translateZ(40px)]
            "
          >
            Екі жүрек бір арнада
            тоғысып, жаңа өмірге
            қадам басқан қуанышты
            күнімізде сіздердің
            ақ тілектеріңіз бен
            ақ баталарыңыз біз үшін
            ерекше қымбат.
          </p>

          <div
            className="
              mt-12
              font-wedding
              text-4xl
              text-[#c89d4b]
              drop-shadow-[0_0_30px_rgba(200,157,75,0.25)]
              [transform:translateZ(100px)]
            "
          >
            {data.groom} & {data.bride}
          </div>

        </motion.div>

      </section>

      {/* ===================================================
          COUNTDOWN 3D
      =================================================== */}

      <section
        className="
          relative
          overflow-hidden
          bg-[#080808]
          px-6
          py-36
        "
      >

        <ThreeDGrid />

        <div className="
          relative
          z-10
          mx-auto
          max-w-5xl
          text-center
        ">

          <ThreeDIcon>
            <Clock
              size={28}
              weight="thin"
            />
          </ThreeDIcon>

          <p className="
            mt-9
            font-readable
            text-[10px]
            tracking-[0.3em]
            text-[#c19a50]
          ">
            ҮЛКЕН КҮНГЕ ДЕЙІН
          </p>

          <h2 className="
            mt-7
            font-wedding
            text-4xl
            leading-tight
            sm:text-6xl
          ">
            Қуанышты күнге
            <br />
            санаулы сәт
          </h2>

          <div className="
            mx-auto
            mt-16
            grid
            max-w-5xl
            grid-cols-2
            gap-4
            sm:grid-cols-4
          ">

            <ThreeDCountdown
              value={timeLeft.days}
              label="КҮН"
            />

            <ThreeDCountdown
              value={timeLeft.hours}
              label="САҒАТ"
            />

            <ThreeDCountdown
              value={timeLeft.minutes}
              label="МИНУТ"
            />

            <ThreeDCountdown
              value={timeLeft.seconds}
              label="СЕКУНД"
            />

          </div>

          <p className="
            mt-10
            font-readable
            text-xs
            text-white/30
          ">
            {data.date} • {data.time}
          </p>

        </div>

      </section>

      {/* ===================================================
          LOVE STORY
      =================================================== */}

      <section
        className="
          relative
          overflow-hidden
          bg-[#050505]
          px-6
          py-40
        "
      >

        <div className="
          relative
          z-10
          mx-auto
          max-w-6xl
        ">

          <SectionTitle3D
            eyebrow="БІЗДІҢ ТАРИХЫМЫЗ"
            title="Екі жүрек — бір тағдыр"
          />

          <div className="
            mt-20
            grid
            items-center
            gap-16
            md:grid-cols-2
          ">

            {/* IMAGE */}

            <ThreeDPhoto
              src={data.gallery?.[0]}
              alt="Біздің тарихымыз"
            />

            {/* TEXT */}

            <motion.div
              initial={{
                opacity: 0,
                x: 70,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 1,
              }}
            >

              <p className="
                font-readable
                text-[10px]
                tracking-[0.35em]
                text-[#bd9143]
              ">
                МАХАББАТ
              </p>

              <h3 className="
                mt-7
                font-wedding
                text-4xl
                leading-tight
                sm:text-6xl
              ">
                Бір кездейсоқ
                <br />
                кездесу...
                <br />
                мәңгілікке
                айналды.
              </h3>

              <p className="
                mt-8
                font-readable
                text-sm
                leading-8
                text-white/40
              ">
                Кейбір кездесулер жай
                ғана кездесу емес.
                Олар адамның өмірін
                өзгертіп, жүрегіне жаңа
                мағына сыйлайды.
              </p>

              <div className="
                mt-10
                h-px
                w-20
                bg-[#c39a4d]
              " />

              <p className="
                mt-8
                font-wedding
                text-2xl
                text-[#c69c4c]
              ">
                Бақыт — бірге бола білу
              </p>

            </motion.div>

          </div>

        </div>

      </section>

      {/* ===================================================
          EVENT INFO
      =================================================== */}

      <section
        className="
          relative
          overflow-hidden
          bg-[#080808]
          px-6
          py-36
        "
      >

        <SectionTitle3D
          eyebrow="ТОЙ ТУРАЛЫ"
          title="Маңызды ақпарат"
        />

        <div className="
          relative
          z-10
          mx-auto
          mt-16
          grid
          max-w-6xl
          gap-6
          md:grid-cols-3
        ">

          <ThreeDInfoCard
            number="01"
            icon={
              <CalendarBlank
                size={28}
                weight="thin"
              />
            }
            title="КҮНІ"
            value={data.date}
          />

          <ThreeDInfoCard
            number="02"
            icon={
              <Clock
                size={28}
                weight="thin"
              />
            }
            title="БАСТАЛУЫ"
            value={data.time}
          />

          <ThreeDInfoCard
            number="03"
            icon={
              <MapPin
                size={28}
                weight="thin"
              />
            }
            title="МЕКЕНЖАЙ"
            value={data.venue}
            description={data.address}
          />

        </div>

      </section>

      {/* ===================================================
          PROGRAM
      =================================================== */}

      <section
        className="
          relative
          bg-[#050505]
          px-6
          py-40
        "
      >

        <SectionTitle3D
          eyebrow="ТОЙ БАҒДАРЛАМАСЫ"
          title="Кешіміздің көрінісі"
        />

        <div className="
          relative
          mx-auto
          mt-20
          max-w-5xl
        ">

          <div className="
            absolute
            bottom-0
            left-5
            top-0
            w-px
            bg-gradient-to-b
            from-transparent
            via-[#c49a4c]/60
            to-transparent
            md:left-1/2
          " />

          {events.map(
            (event, index) => (
              <motion.div
                key={`${event.time}-${index}`}
                initial={{
                  opacity: 0,
                  y: 80,
                  rotateX: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  rotateX: 0,
                }}
                viewport={{
                  once: true,
                  margin: "-100px",
                }}
                transition={{
                  duration: 0.9,
                  delay:
                    index * 0.08,
                }}
                className={`
                  relative
                  mb-14
                  flex
                  ${
                    index % 2 === 0
                      ? "md:justify-start"
                      : "md:justify-end"
                  }
                `}
              >

                <div className="
                  w-full
                  pl-14
                  md:w-[45%]
                  md:pl-0
                ">

                  <motion.div
                    whileHover={{
                      y: -10,
                      rotateX: 5,
                      rotateY:
                        index % 2 === 0
                          ? -4
                          : 4,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 180,
                    }}
                    className="
                      relative
                      overflow-hidden
                      rounded-[2rem]
                      border
                      border-[#c39a4c]/20
                      bg-white/[0.025]
                      p-8
                      shadow-[0_30px_100px_rgba(0,0,0,0.45)]
                      backdrop-blur-xl
                      [transform-style:preserve-3d]
                    "
                  >

                    <span className="
                      absolute
                      right-7
                      top-6
                      font-readable
                      text-[9px]
                      text-[#b38a42]
                    ">
                      {String(
                        index + 1
                      ).padStart(2, "0")}
                    </span>

                    <p className="
                      font-wedding
                      text-3xl
                      leading-tight
                    ">
                      {event.title}
                    </p>

                    <p className="
                      mt-4
                      font-readable
                      text-[10px]
                      tracking-[0.25em]
                      text-[#c19a4e]
                    ">
                      {event.time}
                    </p>

                    <div className="
                      mt-6
                      h-px
                      w-12
                      bg-[#c39a4c]
                    " />

                  </motion.div>

                </div>

                <div className="
                  absolute
                  left-0
                  top-7
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#c39a4c]/60
                  bg-[#080808]
                  font-readable
                  text-xs
                  text-[#d1a653]
                  shadow-[0_0_30px_rgba(200,155,70,0.15)]
                  md:left-[calc(50%-20px)]
                ">
                  {index + 1}
                </div>

              </motion.div>
            )
          )}

        </div>

      </section>

      {/* ===================================================
          GALLERY 3D
      =================================================== */}

      <section
        className="
          relative
          overflow-hidden
          bg-[#080808]
          px-6
          py-40
        "
      >

        <SectionTitle3D
          eyebrow="БІЗДІҢ ЕСТЕЛІКТЕР"
          title="Бақытты сәттер"
        />

        <div className="
          mx-auto
          mt-20
          grid
          max-w-6xl
          grid-cols-2
          gap-4
          md:grid-cols-3
        ">

          {(
            data.gallery ?? []
          ).map(
            (image, index) => (
              <Gallery3D
                key={`${image}-${index}`}
                src={image}
                index={index}
              />
            )
          )}

        </div>

      </section>

      {/* ===================================================
          KAZAKH BLESSING
      =================================================== */}

      <section
        className="
          relative
          isolate
          overflow-hidden
          bg-[#171008]
          px-6
          py-44
          text-center
        "
      >

        <Kazakh3DOrnament />

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.8,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 1.2,
          }}
          className="
            relative
            z-10
            mx-auto
            max-w-4xl
          "
        >

          <StarFour
            size={36}
            weight="thin"
            className="
              mx-auto
              text-[#d6ae5b]
            "
          />

          <p className="
            mt-9
            font-readable
            text-[10px]
            tracking-[0.4em]
            text-[#d6ae5b]
          ">
            АҚ БАТА
          </p>

          <blockquote
            className="
              mt-10
              font-wedding
              text-4xl
              leading-[1.6]
              text-[#f0d998]
              sm:text-6xl
            "
          >
            Ақ мол болсын,
            <br />
            дастархан берекелі болсын.
            <br />
            Екі жасқа бақыт пен
            <br />
            <span className="text-white">
              баянды ғұмыр берсін!
            </span>
          </blockquote>

          <div className="
            mx-auto
            mt-12
            h-px
            w-20
            bg-[#c39a4d]
          " />

          <p className="
            mt-7
            font-readable
            text-xs
            tracking-[0.25em]
            text-white/35
          ">
            АҚ ТІЛЕГІМІЗБЕН
          </p>

        </motion.div>

      </section>

      {/* ===================================================
          FAMILY
      =================================================== */}

      <section
        className="
          bg-[#050505]
          px-6
          py-40
        "
      >

        <SectionTitle3D
          eyebrow="ҚУАНЫШЫМЫЗДЫ БӨЛІСЕТІН"
          title="Ардақты жандар"
        />

        <div className="
          mx-auto
          mt-20
          grid
          max-w-5xl
          gap-6
          md:grid-cols-2
        ">

          <ThreeDFamilyCard
            icon={
              <UsersThree
                size={28}
                weight="thin"
              />
            }
            title="Құдалар"
            text="Екі әулеттің ақ тілегі мен қуанышы — біздің ең үлкен байлығымыз."
          />

          <ThreeDFamilyCard
            icon={
              <Heart
                size={28}
                weight="thin"
              />
            }
            title="Ағайын-туыс"
            text="Ақ дастарханымыздың төрінен сіздерге әрдайым орын бар."
          />

        </div>

      </section>

      {/* ===================================================
          LOCATION
      =================================================== */}

      <section
        className="
          relative
          overflow-hidden
          bg-[#090909]
          px-6
          py-40
          text-center
        "
      >

        <MapPin
          size={36}
          weight="thin"
          className="
            mx-auto
            text-[#c49a4d]
          "
        />

        <p className="
          mt-8
          font-readable
          text-[10px]
          tracking-[0.4em]
          text-[#c49a4d]
        ">
          ТОЙ ӨТЕТІН МЕКЕН
        </p>

        <h2 className="
          mt-7
          font-wedding
          text-5xl
          leading-tight
          sm:text-7xl
        ">
          {data.venue}
        </h2>

        <p className="
          mx-auto
          mt-7
          max-w-xl
          font-readable
          text-sm
          leading-8
          text-white/35
        ">
          {data.address}
        </p>

        <motion.a
          whileHover={{
            scale: 1.05,
            y: -4,
          }}
          whileTap={{
            scale: 0.97,
          }}
          href={`https://2gis.kz/search/${encodeURIComponent(
            `${data.venue}, ${data.address}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="
            mt-10
            inline-flex
            items-center
            gap-3
            rounded-full
            border
            border-[#c49a4d]/50
            px-8
            py-4
            font-readable
            text-[10px]
            tracking-[0.25em]
            text-[#d4aa56]
            transition
            hover:bg-[#c49a4d]
            hover:text-black
          "
        >
          <MapPin size={16} />
          КАРТАДАН КӨРУ
          <ArrowRight size={15} />
        </motion.a>

      </section>

      {/* ===================================================
          RSVP
      =================================================== */}

      <section
        className="
          relative
          overflow-hidden
          bg-[#050505]
          px-6
          py-40
        "
      >

        <div className="
          relative
          z-10
          mx-auto
          max-w-xl
          text-center
        ">

          <ThreeDIcon>
            <UsersThree
              size={28}
              weight="thin"
            />
          </ThreeDIcon>

          <p className="
            mt-9
            font-readable
            text-[10px]
            tracking-[0.35em]
            text-[#c49a4d]
          ">
            ҚАТЫСУЫҢЫЗДЫ РАСТАҢЫЗ
          </p>

          <h2 className="
            mt-7
            font-wedding
            text-5xl
            sm:text-7xl
          ">
            Тойға келесіз бе?
          </h2>

          <p className="
            mt-7
            font-readable
            text-sm
            leading-8
            text-white/35
          ">
            Келетініңізді алдын ала
            хабарлауыңызды сұраймыз.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-12 space-y-4"
          >

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Аты-жөніңіз"
              className="
                w-full
                rounded-2xl
                border
                border-white/10
                bg-white/[0.025]
                px-5
                py-5
                font-readable
                text-sm
                text-white
                outline-none
                placeholder:text-white/20
                focus:border-[#c49a4d]/60
              "
            />

            <input
              type="number"
              min={1}
              value={guests}
              onChange={(e) =>
                setGuests(
                  Number(
                    e.target.value
                  )
                )
              }
              placeholder="Қонақтар саны"
              className="
                w-full
                rounded-2xl
                border
                border-white/10
                bg-white/[0.025]
                px-5
                py-5
                font-readable
                text-sm
                text-white
                outline-none
                placeholder:text-white/20
                focus:border-[#c49a4d]/60
              "
            />

            <div className="
              grid
              grid-cols-2
              gap-3
            ">

              <button
                type="button"
                onClick={() =>
                  setAttending(true)
                }
                className={`
                  rounded-2xl
                  border
                  px-4
                  py-5
                  font-readable
                  text-xs
                  transition
                  ${
                    attending === true
                      ? "border-[#c49a4d] bg-[#c49a4d] text-black"
                      : "border-white/10 bg-white/[0.025] text-white/50"
                  }
                `}
              >
                ИӘ, КЕЛЕМІН
              </button>

              <button
                type="button"
                onClick={() =>
                  setAttending(false)
                }
                className={`
                  rounded-2xl
                  border
                  px-4
                  py-5
                  font-readable
                  text-xs
                  transition
                  ${
                    attending === false
                      ? "border-[#c49a4d] bg-[#c49a4d] text-black"
                      : "border-white/10 bg-white/[0.025] text-white/50"
                  }
                `}
              >
                КЕЛЕ АЛМАЙМЫН
              </button>

            </div>

            {message && (
              <motion.p
                initial={{
                  opacity: 0,
                  y: -10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="
                  font-readable
                  text-sm
                  text-white/50
                "
              >
                {message}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                rounded-2xl
                bg-[#c49a4d]
                px-6
                py-5
                font-readable
                text-xs
                font-semibold
                tracking-[0.1em]
                text-black
                transition
                hover:bg-[#dfbb72]
                disabled:opacity-50
              "
            >
              {loading
                ? "ЖІБЕРІЛУДЕ..."
                : "ЖАУАПТЫ ЖІБЕРУ"}
            </button>

          </form>

        </div>

      </section>

      {/* ===================================================
          FINAL 3D
      =================================================== */}

      <section
        className="
          relative
          flex
          min-h-[100svh]
          items-center
          justify-center
          overflow-hidden
          bg-black
          px-6
          text-center
        "
      >

        <div className="absolute inset-0">
          <ThreeDFinal />
        </div>

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.7,
            rotateX: 20,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
            rotateX: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 1.5,
          }}
          className="
            relative
            z-10
            [transform-style:preserve-3d]
          "
        >

          <Heart
            size={30}
            weight="thin"
            className="
              mx-auto
              text-[#d5aa55]
              drop-shadow-[0_0_30px_rgba(213,170,85,0.5)]
            "
          />

          <p className="
            mt-9
            font-readable
            text-[10px]
            tracking-[0.35em]
            text-[#c49a4d]
          ">
            ТОЙЫМЫЗДА ЖҮЗДЕСКЕНШЕ!
          </p>

          <h2 className="
            mt-12
            font-wedding
            text-6xl
            text-[#f1d999]
            drop-shadow-[0_20px_50px_rgba(200,155,70,0.2)]
            sm:text-8xl
          ">
            {data.groom}
          </h2>

          <div className="
            my-5
            font-wedding
            text-4xl
            text-[#c89d4b]
          ">
            &
          </div>

          <h2 className="
            font-wedding
            text-6xl
            text-[#f1d999]
            sm:text-8xl
          ">
            {data.bride}
          </h2>

          <div className="
            mx-auto
            my-12
            h-px
            w-20
            bg-[#c49a4d]
          " />

          <p className="
            font-readable
            text-xs
            tracking-[0.3em]
            text-white/30
          ">
            {data.date}
          </p>

        </motion.div>

      </section>

    </main>
  );
}

/* =========================================================
   3D WORLD
========================================================= */

function ThreeDWorld() {
  return (
    <Canvas
      dpr={[1, 1.35]}
      camera={{
        position: [
          0,
          0,
          8,
        ],
        fov: 42,
      }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference:
          "high-performance",
      }}
    >

      <PerspectiveCamera
        makeDefault
        position={[
          0,
          0,
          8,
        ]}
        fov={42}
      />

      <ambientLight
        intensity={0.25}
      />

      <pointLight
        position={[
          4,
          4,
          5,
        ]}
        intensity={12}
        color="#d7aa4f"
      />

      <pointLight
        position={[
          -4,
          -2,
          3,
        ]}
        intensity={6}
        color="#8c682e"
      />

      <Sparkles
        count={150}
        scale={14}
        size={1.1}
        speed={0.12}
        opacity={0.55}
        color="#d6ad58"
      />

      <Float
        speed={0.45}
        rotationIntensity={0.18}
        floatIntensity={0.4}
      >
        <WeddingRings3D />
      </Float>

      <Orbit3D />

      <Environment
        preset="night"
      />

    </Canvas>
  );
}

/* =========================================================
   RINGS
========================================================= */

function WeddingRings3D() {
  const ref =
    useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current)
      return;

    const t =
      state.clock.elapsedTime;

    ref.current.rotation.y =
      t * 0.18;

    ref.current.rotation.x =
      Math.sin(t * 0.4) *
      0.12;

    ref.current.position.y =
      Math.sin(t * 0.7) *
      0.12;
  });

  return (
    <group
      ref={ref}
      scale={1.15}
    >

      <mesh
        position={[
          -0.72,
          0,
          0,
        ]}
        rotation={[
          Math.PI / 2,
          0.18,
          0.1,
        ]}
      >

        <torusGeometry
          args={[
            1.55,
            0.055,
            24,
            160,
          ]}
        />

        <meshPhysicalMaterial
          color="#c99b43"
          metalness={1}
          roughness={0.12}
          clearcoat={1}
          clearcoatRoughness={0.04}
          emissive="#5e3e0d"
          emissiveIntensity={0.35}
        />

      </mesh>

      <mesh
        position={[
          0.72,
          0,
          0.15,
        ]}
        rotation={[
          Math.PI / 2,
          -0.18,
          -0.1,
        ]}
      >

        <torusGeometry
          args={[
            1.55,
            0.055,
            24,
            160,
          ]}
        />

        <meshPhysicalMaterial
          color="#e1b65d"
          metalness={1}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.03}
          emissive="#68470f"
          emissiveIntensity={0.3}
        />

      </mesh>

      <mesh
        position={[
          0,
          0,
          0.75,
        ]}
      >

        <icosahedronGeometry
          args={[
            0.22,
            2,
          ]}
        />

        <MeshTransmissionMaterial
          samples={4}
          thickness={0.5}
          chromaticAberration={0.04}
          anisotropy={0.15}
          distortion={0.08}
          distortionScale={0.2}
          temporalDistortion={0.1}
          color="#fff4cf"
        />

      </mesh>

    </group>
  );
}

/* =========================================================
   ORBIT
========================================================= */

function Orbit3D() {
  const ref =
    useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current)
      return;

    const t =
      state.clock.elapsedTime;

    ref.current.rotation.y =
      t * 0.08;

    ref.current.rotation.x =
      Math.sin(t * 0.2) *
      0.25;
  });

  return (
    <group ref={ref}>

      <mesh
        rotation={[
          1,
          0.4,
          0,
        ]}
      >

        <torusGeometry
          args={[
            3.2,
            0.012,
            12,
            160,
          ]}
        />

        <meshBasicMaterial
          color="#c59b4b"
          transparent
          opacity={0.2}
        />

      </mesh>

      <mesh
        rotation={[
          0.3,
          1.2,
          0.4,
        ]}
      >

        <torusGeometry
          args={[
            4.2,
            0.008,
            12,
            160,
          ]}
        />

        <meshBasicMaterial
          color="#d7ae59"
          transparent
          opacity={0.12}
        />

      </mesh>

    </group>
  );
}

/* =========================================================
   SECTION BACKGROUND
========================================================= */

function Section3DBackground() {
  return (
    <div
      className="
        pointer-events-none
        absolute
        inset-0
      "
    >

      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-[500px]
          w-[500px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#b98b3c]/10
          blur-[130px]
        "
      />

      <SparkleField />

    </div>
  );
}

/* =========================================================
   SPARKLE FIELD
========================================================= */

function SparkleField() {
  return (
    <>
      {Array.from({
        length: 12,
      }).map((_, i) => (
        <motion.span
          key={i}
          animate={{
            y: [
              0,
              -25,
              0,
            ],
            opacity: [
              0.1,
              0.8,
              0.1,
            ],
            scale: [
              0.7,
              1.2,
              0.7,
            ],
          }}
          transition={{
            duration:
              4 + (i % 3),
            delay:
              i * 0.25,
            repeat: Infinity,
          }}
          className="
            absolute
            h-1
            w-1
            rounded-full
            bg-[#d8b05a]
            shadow-[0_0_18px_#d8b05a]
          "
          style={{
            left: `${8 + ((i * 31) % 84)}%`,
            top: `${10 + ((i * 19) % 75)}%`,
          }}
        />
      ))}
    </>
  );
}

/* =========================================================
   ICON
========================================================= */

function ThreeDIcon({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      whileHover={{
        rotateY: 12,
        rotateX: -8,
        scale: 1.05,
      }}
      className="
        mx-auto
        flex
        h-20
        w-20
        items-center
        justify-center
        rounded-full
        border
        border-[#c49a4d]/50
        bg-[#0b0b0b]/80
        text-[#d4aa55]
        shadow-[0_0_70px_rgba(196,154,77,0.14)]
        backdrop-blur-xl
        [transform-style:preserve-3d]
      "
    >
      {children}
    </motion.div>
  );
}

/* =========================================================
   SECTION TITLE
========================================================= */

function SectionTitle3D({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 50,
        rotateX: 15,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        rotateX: 0,
      }}
      viewport={{
        once: true,
      }}
      transition={{
        duration: 1,
      }}
      className="
        relative
        z-10
        text-center
      "
    >

      <div className="
        mb-7
        flex
        items-center
        justify-center
        gap-4
      ">

        <span className="
          h-px
          w-12
          bg-[#c39a4c]/40
        " />

        <Sparkle
          size={15}
          weight="thin"
          className="
            text-[#d1a653]
          "
        />

        <span className="
          h-px
          w-12
          bg-[#c39a4c]/40
        " />

      </div>

      <p className="
        font-readable
        text-[10px]
        tracking-[0.35em]
        text-[#c39a4c]
      ">
        {eyebrow}
      </p>

      <h2 className="
        mt-6
        font-wedding
        text-5xl
        leading-tight
        sm:text-7xl
      ">
        {title}
      </h2>

    </motion.div>
  );
}

/* =========================================================
   COUNTDOWN
========================================================= */

function ThreeDCountdown({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <motion.div
      whileHover={{
        y: -12,
        rotateX: 7,
        rotateY: -5,
        scale: 1.03,
      }}
      transition={{
        type: "spring",
        stiffness: 180,
        damping: 18,
      }}
      className="
        relative
        overflow-hidden
        rounded-[2rem]
        border
        border-[#c39a4c]/20
        bg-white/[0.025]
        px-4
        py-8
        shadow-[0_30px_80px_rgba(0,0,0,0.45)]
        backdrop-blur-xl
        [transform-style:preserve-3d]
      "
    >

      <div
        className="
          absolute
          -right-12
          -top-12
          h-32
          w-32
          rounded-full
          bg-[#c49a4d]/10
          blur-3xl
        "
      />

      <div className="
        relative
        font-wedding
        text-5xl
        text-[#d7af5c]
        drop-shadow-[0_0_25px_rgba(215,175,92,0.2)]
        sm:text-6xl
      ">
        {String(value).padStart(
          2,
          "0"
        )}
      </div>

      <div className="
        relative
        mt-4
        font-readable
        text-[8px]
        tracking-[0.25em]
        text-white/30
      ">
        {label}
      </div>

    </motion.div>
  );
}

/* =========================================================
   INFO CARD
========================================================= */

function ThreeDInfoCard({
  number,
  icon,
  title,
  value,
  description,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  value: string;
  description?: string;
}) {
  return (
    <motion.div
      whileHover={{
        y: -14,
        rotateX: 6,
        rotateY: -5,
        scale: 1.025,
      }}
      transition={{
        type: "spring",
        stiffness: 180,
        damping: 18,
      }}
      className="
        group
        relative
        overflow-hidden
        rounded-[2rem]
        border
        border-[#c39a4c]/20
        bg-white/[0.025]
        p-9
        text-center
        shadow-[0_30px_100px_rgba(0,0,0,0.45)]
        backdrop-blur-xl
        [transform-style:preserve-3d]
      "
    >

      <span className="
        absolute
        right-7
        top-6
        font-readable
        text-[9px]
        text-[#a9823d]
      ">
        {number}
      </span>

      <div className="
        mx-auto
        flex
        h-16
        w-16
        items-center
        justify-center
        rounded-full
        border
        border-[#c39a4c]/40
        bg-black/30
        text-[#d1a553]
        shadow-[0_0_35px_rgba(200,155,70,0.12)]
      ">
        {icon}
      </div>

      <p className="
        mt-7
        font-readable
        text-[9px]
        tracking-[0.2em]
        text-white/25
      ">
        {title}
      </p>

      <p className="
        mt-5
        font-wedding
        text-2xl
        leading-tight
      ">
        {value}
      </p>

      {description && (
        <p className="
          mt-4
          font-readable
          text-sm
          leading-6
          text-white/35
        ">
          {description}
        </p>
      )}

    </motion.div>
  );
}

/* =========================================================
   PHOTO
========================================================= */

function ThreeDPhoto({
  src,
  alt,
}: {
  src?: string;
  alt: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: -70,
        rotateY: 20,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        rotateY: 0,
      }}
      whileHover={{
        rotateY: -7,
        rotateX: 4,
        scale: 1.025,
      }}
      viewport={{
        once: true,
      }}
      transition={{
        duration: 1,
      }}
      className="
        relative
        aspect-[4/5]
        overflow-hidden
        rounded-[2rem]
        border
        border-[#c39a4c]/20
        bg-[#0b0b0b]
        shadow-[0_40px_120px_rgba(0,0,0,0.55)]
        [transform-style:preserve-3d]
      "
    >

      {src && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="
            (max-width:768px) 100vw,
            50vw
          "
          className="
            object-cover
            transition
            duration-1000
            hover:scale-110
          "
        />
      )}

      <div className="
        absolute
        inset-0
        bg-gradient-to-t
        from-black/60
        via-transparent
        to-transparent
      " />

      <div className="
        absolute
        bottom-8
        left-8
      ">

        <p className="
          font-readable
          text-[9px]
          tracking-[0.3em]
          text-white/50
        ">
          БІРГЕ
        </p>

        <p className="
          mt-2
          font-wedding
          text-4xl
        ">
          мәңгілікке
        </p>

      </div>

    </motion.div>
  );
}

/* =========================================================
   GALLERY
========================================================= */

function Gallery3D({
  src,
  index,
}: {
  src: string;
  index: number;
}) {
  const featured =
    index === 0 ||
    index === 3 ||
    index === 6;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 80,
        rotateX: 20,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        rotateX: 0,
      }}
      whileHover={{
        y: -12,
        rotateX: 5,
        rotateY:
          index % 2 === 0
            ? -5
            : 5,
        scale: 1.025,
      }}
      viewport={{
        once: true,
      }}
      transition={{
        duration: 0.8,
        delay:
          index * 0.05,
      }}
      className={`
        group
        relative
        overflow-hidden
        rounded-[1.5rem]
        border
        border-white/10
        bg-black
        shadow-[0_30px_90px_rgba(0,0,0,0.5)]
        [transform-style:preserve-3d]
        ${
          featured
            ? "col-span-2 aspect-[16/10]"
            : "aspect-square"
        }
      `}
    >

      <Image
        src={src}
        alt={`Естелік ${index + 1}`}
        fill
        sizes="
          (max-width:640px) 50vw,
          33vw
        "
        className="
          object-cover
          transition
          duration-1000
          group-hover:scale-110
        "
      />

      <div className="
        absolute
        inset-0
        bg-black/10
        transition
        duration-500
        group-hover:bg-black/30
      " />

      <div className="
        absolute
        inset-4
        rounded-xl
        border
        border-white/0
        transition
        duration-500
        group-hover:border-white/30
      " />

    </motion.div>
  );
}

/* =========================================================
   FAMILY CARD
========================================================= */

function ThreeDFamilyCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <motion.div
      whileHover={{
        y: -12,
        rotateX: 5,
        rotateY: -4,
      }}
      className="
        rounded-[2rem]
        border
        border-[#c39a4c]/20
        bg-white/[0.025]
        p-10
        text-center
        shadow-[0_30px_100px_rgba(0,0,0,0.45)]
        backdrop-blur-xl
        [transform-style:preserve-3d]
      "
    >

      <div className="
        mx-auto
        flex
        h-16
        w-16
        items-center
        justify-center
        rounded-full
        border
        border-[#c39a4c]/40
        text-[#d0a653]
      ">
        {icon}
      </div>

      <h3 className="
        mt-7
        font-wedding
        text-3xl
      ">
        {title}
      </h3>

      <p className="
        mx-auto
        mt-5
        max-w-sm
        font-readable
        text-sm
        leading-7
        text-white/35
      ">
        {text}
      </p>

    </motion.div>
  );
}

/* =========================================================
   KAZAKH 3D ORNAMENT
========================================================= */

function Kazakh3DOrnament() {
  return (
    <>
      <motion.div
        animate={{
          rotate: [
            0,
            360,
          ],
          scale: [
            1,
            1.05,
            1,
          ],
        }}
        transition={{
          rotate: {
            duration: 45,
            repeat: Infinity,
            ease: "linear",
          },
          scale: {
            duration: 8,
            repeat: Infinity,
          },
        }}
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[700px]
          w-[700px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          border
          border-[#c39a4c]/10
          [transform-style:preserve-3d]
        "
      />

      <motion.div
        animate={{
          rotate: [
            360,
            0,
          ],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        }}
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[500px]
          w-[500px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          border
          border-[#c39a4c]/10
        "
      />

      <div className="
        pointer-events-none
        absolute
        left-1/2
        top-1/2
        h-[400px]
        w-[400px]
        -translate-x-1/2
        -translate-y-1/2
        rounded-full
        bg-[#c39a4c]/10
        blur-[120px]
      " />

    </>
  );
}

/* =========================================================
   GRID
========================================================= */

function ThreeDGrid() {
  return (
    <div
      className="
        pointer-events-none
        absolute
        inset-0
        opacity-[0.08]
      "
      style={{
        backgroundImage:
          `
          linear-gradient(
            rgba(205,165,85,0.4) 1px,
            transparent 1px
          ),
          linear-gradient(
            90deg,
            rgba(205,165,85,0.4) 1px,
            transparent 1px
          )
          `,
        backgroundSize:
          "60px 60px",
        transform:
          "perspective(600px) rotateX(60deg) scale(1.5)",
        transformOrigin:
          "center bottom",
      }}
    />
  );
}

/* =========================================================
   FINAL 3D WORLD
========================================================= */

function ThreeDFinal() {
  return (
    <Canvas
      dpr={[1, 1.25]}
      camera={{
        position: [
          0,
          0,
          9,
        ],
        fov: 45,
      }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference:
          "high-performance",
      }}
    >

      <ambientLight
        intensity={0.2}
      />

      <pointLight
        position={[
          0,
          0,
          5,
        ]}
        intensity={15}
        color="#d8ae58"
      />

      <Sparkles
        count={180}
        scale={15}
        size={1.2}
        speed={0.12}
        color="#d5ac56"
      />

      <Float
        speed={0.25}
        rotationIntensity={0.1}
        floatIntensity={0.25}
      >
        <FinalRing />
      </Float>

    </Canvas>
  );
}

/* =========================================================
   FINAL RING
========================================================= */

function FinalRing() {
  const ref =
    useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current)
      return;

    const t =
      state.clock.elapsedTime;

    ref.current.rotation.x =
      t * 0.08;

    ref.current.rotation.y =
      t * 0.12;
  });

  return (
    <mesh
      ref={ref}
      rotation={[
        1.2,
        0.2,
        0,
      ]}
    >

      <torusKnotGeometry
        args={[
          2.8,
          0.025,
          160,
          24,
          2,
          3,
        ]}
      />

      <meshPhysicalMaterial
        color="#b98932"
        metalness={1}
        roughness={0.15}
        clearcoat={1}
        emissive="#4e3108"
        emissiveIntensity={0.35}
        transparent
        opacity={0.32}
      />

    </mesh>
  );
}