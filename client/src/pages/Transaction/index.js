import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import NumberFormat from "react-number-format";

//CSS
import "./Transaction.scss";

//Config
import { API, setAuthToken } from "../../config/API";

//Components
import Header from "../../components/molecules/Header";
import Gap from "../../components/atoms/Gap";
import { ReactComponent as CompletedIcon } from "../../assets/logos/completeIcon.svg";
import { ReactComponent as CancelIcon } from "../../assets/logos/cancelIcon.svg";
import { ReactComponent as WaitingIcon } from "../../assets/logos/waitingLogo.svg";

const Transaction = () => {
  const router = useHistory();

  //Get UserInfo
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const token = localStorage.getItem("token");

  //Modal
  const [modalShow, setModalShow] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [description, setDescription] = useState(undefined);

  //State
  const [dataOffers, setDataOffers] = useState(undefined);
  const [dataOrders, setDataOrders] = useState(undefined);
  const options = { year: "numeric", month: "long", day: "numeric" };
  const [key, setKey] = useState("order");

  const getTransactions = async () => {
    try {
      setAuthToken(token);
      const transactionOffer = await API.get(`/transactions-offer/${user.id}`);
      setDataOffers(
        transactionOffer.data.data.transactions.sort((a, b) => a - b).reverse()
      );
      const transactionOrder = await API.get(`/transactions-order/${user.id}`);
      setDataOrders(
        transactionOrder.data.data.transactions.sort((a, b) => a - b).reverse()
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTransactions();
  }, []);

  const setModalData = (data) => {
    setDescription(data);
    setModalShow(true);
  };

  const handleApprove = async (id) => {
    try {
      const body = { status: "on going progress" };
      await API.patch(`/transaction/${id}`, body);
      setModalShow(false);
      getTransactions();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = async (id) => {
    try {
      const body = { status: "canceled" };
      await API.patch(`/transaction/${id}`, body);
      setModalShow(false);
      getTransactions();
    } catch (error) {
      console.log(error);
    }
  };

  const toAddProject = (id) => {
    router.push(`/add-project/${id}`);
  };

  const toViewProject = (id) => {
    router.push(`/view-project/${id}`);
  };

  return dataOffers == undefined || dataOrders == undefined ? (
    <h1>Loading...</h1>
  ) : (
    <Container fluid>
      <Header />
      <Tabs
        className="transaction-tab-container"
        id="controlled-tab-example"
        onSelect={(k) => setKey(k)}
      >
        <Tab className="text-table-all" eventKey="order" title="My Order">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th className="align-text">No</th>
                <th>Vendor</th>
                <th>Order</th>
                <th>Start Project</th>
                <th>End Project</th>
                <th>Status</th>
                <th className="align-text">Action</th>
              </tr>
            </thead>
            {dataOrders.length == 0 ? (
              <div>No Orders Yet</div>
            ) : (
              <tbody>
                {dataOrders.map((order, index) => (
                  <tr key={index}>
                    <td className="align-text">{index + 1}</td>
                    <td>{order.orderedTo.fullname}</td>
                    <td>
                      <span
                        className="transaction-title-link"
                        onClick={() => setModalData(order)}
                      >
                        {order.title}
                      </span>
                    </td>
                    <td>
                      {new Date(order.startDate).toLocaleDateString(
                        [],
                        options
                      )}
                    </td>
                    <td>
                      {new Date(order.endDate).toLocaleDateString([], options)}
                    </td>
                    <td>
                      <span
                        style={{
                          color:
                            order.status === "waiting approval" ||
                            order.status === "on going progress"
                              ? "#FF9900"
                              : order.status === "completed"
                              ? "#28a646"
                              : order.status === "canceled"
                              ? "#E83939"
                              : "#00D1FF",
                        }}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="align-text">
                      {order.status === "waiting approval" ||
                      order.status === "on going progress" ? (
                        <WaitingIcon />
                      ) : order.status === "success" ? (
                        <CompletedIcon />
                      ) : order.status === "canceled" ? (
                        <CancelIcon />
                      ) : (
                        <div className="transaction-btn-send-container">
                          <Button
                            className="btn-transaction-send-project"
                            variant="success"
                            onClick={() => toViewProject(order.id)}
                          >
                            View Project
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </Table>
        </Tab>
        <Tab className="text-table-all" eventKey="offer" title="My Offer">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th className="align-text">No</th>
                <th>Client</th>
                <th>Order</th>
                <th>Start Project</th>
                <th>End Project</th>
                <th>Status</th>
                <th className="align-text">Action</th>
              </tr>
            </thead>
            {dataOffers.length == 0 ? (
              <div>No Offers Yet</div>
            ) : (
              <tbody>
                {dataOffers.map((offer, index) => (
                  <tr key={index}>
                    <td className="align-text">{index + 1}</td>
                    <td>{offer.orderedBy.fullname}</td>
                    <td>
                      <span
                        className="transaction-title-link"
                        onClick={() => setModalData(offer)}
                      >
                        {offer.title}
                      </span>
                    </td>
                    <td>
                      {new Date(offer.startDate).toLocaleDateString(
                        [],
                        options
                      )}
                    </td>
                    <td>
                      {new Date(offer.endDate).toLocaleDateString([], options)}
                    </td>
                    <td>
                      <span
                        style={{
                          color:
                            offer.status === "waiting approval" ||
                            offer.status === "on going progress"
                              ? "#FF9900"
                              : offer.status === "success"
                              ? "#28a646"
                              : offer.status === "canceled"
                              ? "#E83939"
                              : "#00D1FF",
                        }}
                      >
                        {offer.status}
                      </span>
                    </td>
                    <td className="align-text">
                      {offer.status === "waiting approval" ? (
                        <div className="transaction-btn-confirms-container">
                          <Button
                            className="btn-transaction-cancel"
                            variant="danger"
                            onClick={() => handleCancel(offer.id)}
                          >
                            Cancel
                          </Button>
                          <Gap width={10} />
                          <Button
                            className="btn-transaction-approve"
                            variant="success"
                            onClick={() => handleApprove(offer.id)}
                          >
                            Approve
                          </Button>
                        </div>
                      ) : offer.status === "success" ? (
                        <CompletedIcon />
                      ) : offer.status === "canceled" ? (
                        <CancelIcon />
                      ) : offer.status === "waiting approved project" ? (
                        <div className="transaction-btn-confirms-container">
                          <Button
                            className="btn-transaction-view-project"
                            variant="success"
                            onClick={() => toViewProject(offer.id)}
                          >
                            View Project
                          </Button>
                        </div>
                      ) : (
                        <div className="transaction-btn-send-container">
                          <Button
                            className="btn-transaction-send-project"
                            variant="info"
                            onClick={() => toAddProject(offer.id)}
                          >
                            Send Project
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </Table>
        </Tab>
      </Tabs>
      {description != undefined && (
        <Modal
          size="lg"
          show={modalShow}
          onHide={() => setModalShow(false)}
          centered
          transparent={true}
          dialogClassName="transactions-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>{description.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h6>
              <strong>Description :</strong>
            </h6>
            {description.description}
            <Gap height={10} />

            <h6>
              <strong>Price :</strong>
            </h6>
            <div className="transaction-price-color">
              <NumberFormat
                value={description.price}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"Rp, "}
                renderText={(value) => <span>{value}</span>}
              />
            </div>

            <Gap height={15} />
            <Modal.Footer>
              {key === "offer" ? (
                <div>
                  {description.status === "canceled" ||
                  description.status === "success" ? (
                    <Button
                      className="transaction-ok-btn"
                      variant="info"
                      onClick={() => setModalShow(false)}
                    >
                      Close
                    </Button>
                  ) : description.status === "waiting approval" ? (
                    <div>
                      <Button
                        className="transaction-ok-btn"
                        variant="danger"
                        onClick={() => handleCancel(description.id)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="transaction-ok-btn"
                        variant="success"
                        onClick={() => handleApprove(description.id)}
                      >
                        Approve
                      </Button>
                    </div>
                  ) : description.status === "waiting approved project" ? (
                    <Button
                      className="transaction-send-btn"
                      variant="success"
                      onClick={() => toViewProject(description.id)}
                    >
                      View Project
                    </Button>
                  ) : description.status === "on going progress" ? (
                    <Button
                      className="transaction-send-btn"
                      variant="info"
                      onClick={() => toAddProject(description.id)}
                    >
                      Send Project
                    </Button>
                  ) : null}
                </div>
              ) : (
                <div>
                  {description.status === "canceled" ||
                  description.status === "success" ||
                  description.status === "on going progress" ? (
                    <Button
                      className="transaction-ok-btn"
                      variant="info"
                      onClick={() => setModalShow(false)}
                    >
                      Close
                    </Button>
                  ) : description.status === "waiting approval" ? (
                    <div>
                      <Button
                        className="transaction-ok-btn-cancel"
                        variant="danger"
                        onClick={() => handleCancel(description.id)}
                      >
                        Cancel Order
                      </Button>
                      <Button
                        className="transaction-ok-btn"
                        variant="info"
                        onClick={() => setModalShow(false)}
                      >
                        Close
                      </Button>
                    </div>
                  ) : description.status === "project completed" ||
                    description.status === "waiting approved project" ? (
                    <Button
                      className="transaction-send-btn"
                      variant="success"
                      onClick={() => setModalShow(false)}
                    >
                      View Project
                    </Button>
                  ) : null}
                </div>
              )}
            </Modal.Footer>
          </Modal.Body>
        </Modal>
      )}
    </Container>
  );
};

export default Transaction;
