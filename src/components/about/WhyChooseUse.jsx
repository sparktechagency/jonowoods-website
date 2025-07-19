import React from "react";
import { Card } from "../ui/card";

const WhyChooseUs = () => {
  return (
    <div className=" py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Why Choose Us ?
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Left Side Cards */}
          <div className="space-y-8">
            <Card className=" p-6 rounded-lg border-2 border-[#2E2E2EF5] bg-[#18191B] shadow-lg">
              <h2 className="text-2xl text-white bg font-semibold mb-2">
                Quality You Can Trust
              </h2>
              <p className="text-description">
                Every product and grocery space that you`ll do today is
                guaranteed to be a customer, customers, and stores. Your key
                brands are higher standards for reliability, trust, and customer
                satisfaction.
              </p>
            </Card>

            <Card className=" p-6 rounded-lg shadow-lg border-2 border-[#2E2E2EF5] bg-[#18191B]">
              <h2 className=" text-white bg font-semibold mb-2">
                Expertly Crafted
              </h2>
              <p className="text-description">
                Our team works diligently to design and deliver exceptional
                products with the highest quality, innovation, and reliability.
              </p>
            </Card>
          </div>

          {/* Middle Image */}
          <div className="flex justify-center">
            <Image
              src="/assests/aboutPage3.png"
              alt="Why Choose Us"
              width={100}
              height={100}
              className="w-1/2 max-w-xs h-"
            />
          </div>

          {/* Right Side Cards */}
          <div className="space-y-8">
            <Card className=" p-6 rounded-lg shadow-lg border-2 border-[#2E2E2EF5] bg-[#18191B]">
              <h2 className="text-2xl font-semibold mb-2 text-white">
                Community Focused
              </h2>
              <p className="text-description ">
                We are committed to giving back, fostering positive change, and
                ensuring sustainable values for our customers.
              </p>
            </Card>

            <Card className=" p-6 rounded-lg shadow-lg border-2 border-[#2E2E2EF5] bg-[#18191B]">
              <h2 className="text-2xl font-semibold mb-2 text-white">
                Customer Satisfaction
              </h2>
              <p className="text-description">
                We prioritize customer happiness, offering excellent support and
                quality products that exceed expectations.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
