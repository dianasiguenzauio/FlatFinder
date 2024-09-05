import NavbarContainer from "../components/Commons/Navbar";
import MessagePage from "../components/Messages/MessageForm";
import MisMessages from "../components/Messages/MessageList";

function FlatDetailsPage() {
  return (
    <>
      <div>
        <NavbarContainer />

        <MessagePage></MessagePage>
        <MisMessages></MisMessages>
      </div>
    </>
  );
}
export default FlatDetailsPage;
