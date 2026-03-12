import React from "react";
import Link from "next/link";
import Image from "next/image";

const CareerDevelopmentSection: React.FC = () => {
  const cards = [
    {
      title: "Easy ways to build a Resume and connect with the employers faster",
      date: "Jobpot 07/02/1960",
      image: "/assets/Images/creer-dev-one.png",
      body: "Aenean sed nibh a magna posuere tempor. Nunc faucibus pellentesque nunc in aliquet. Donec congue, nunc vel tempor congue, enim sapien lobortis ipsum, in volutpat sem ex in ligula. Nunc purus est, consequat condimentum faucibus sed, iaculis sit amet massa. Fusce",
      link: "/",
    },
    {
      title: "Find a Holiday in job 2021",
      date: "Jobpot 07/02/1960",
      image: "/assets/Images/creer-dev-one.png",
      body: "Aenean sed nibh a magna posuere tempor. Nunc faucibus pellentesque nunc in aliquet. Donec congue, nunc vel tempor congue, enim sapien lobortis ipsum, in volutpat sem ex in ligula. Nunc purus est, consequat condimentum faucibus sed, iaculis sit amet massa. Fusce",
      link: "/",
    },
    {
      title: "Job resources",
      date: "Jobpot 07/02/1960",
      image: "/assets/Images/creer-dev-one.png",
      body: "Aenean sed nibh a magna posuere tempor. Nunc faucibus pellentesque nunc in aliquet. Donec congue, nunc vel tempor congue, enim sapien lobortis ipsum, in volutpat sem ex in ligula. Nunc purus est, consequat condimentum faucibus sed, iaculis sit amet massa. Fusce",
      link: "/",
    },
  ];

  return (
    <section className="cr-dev-and-learning">
      <div className="title">see how you can up your career status</div>
      <div className="subtitle">Career Development & Learning</div>

      <div className="body">
        <div className="container">
          <div className="row">
            {cards.map((card, index) => (
              <div className="col-lg-4 col-md-6 col-sm-12" key={index}>
                <div className="cr-dev-card">
                  <div className="header">
                    <div className="image">
                      <Image
                        className="cr-dev-img"
                        src={card.image}
                        alt={card.title}
                        width={500}
                        height={300}
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="sub-header">
                      <div className="title">{card.title}</div>
                      <div className="date">{card.date}</div>
                    </div>
                  </div>
                  <div className="body">{card.body}</div>
                  <div className="footer">
                    <Link href={card.link}>Read more...</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="footer">
        <div className="read-more">
          <Link className="view-all" href="/">View All</Link>
        </div>
      </div>
    </section>
  );
};

export default CareerDevelopmentSection;