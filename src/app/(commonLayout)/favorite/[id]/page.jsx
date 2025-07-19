import DetailsComponents from "@/components/favorite/details/DetailsComponents";

const page = ({ params }) => {
  return (
    <div>
      <DetailsComponents params={params} />
    </div>
  );
};

export default page;
