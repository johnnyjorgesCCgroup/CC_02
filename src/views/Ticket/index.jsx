import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Menu from "../../components/Menu";
import ContentTicket from "../../components/Ticket/Ticket";
const indexTicket = () => {
  return (
    <div className="wrapper">
      <Menu />
      <>
        <Header />
        <ContentTicket />
        <Footer />
      </>
    </div>
  );
};

export default indexTicket;
