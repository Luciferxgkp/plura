const Index = ({ params }: { params: { agencyId: string } }) => {
  return (
    <div>
      <h1>Agency</h1>
      <p>agencyId: {params.agencyId}</p>
    </div>
  );
};

export default Index;
