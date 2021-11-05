import ContractCallDecoder from "@ethereum-sourcify/contract-call-decoder";
import { useState } from "react";
import { Button, Col, Container, Form, Image, Row } from "react-bootstrap";
import "./App.css";

function App() {
  const [byteCode, setByteCode] = useState();
  const [metadataHash, setMetadataHash] = useState();

  const handleByteCodeChange = (e) => {
    console.log("change");
    setByteCode(e.target.value);
    console.log("chaged OK");
  };

  const decode = async () => {
    const formattedBytecode = byteCode.startsWith("0x")
      ? byteCode.trim()
      : "0x" + byteCode.trim();
    console.log("Decoding");
    try {
      const hashObject = await ContractCallDecoder.decodeMetadataHash(
        formattedBytecode
      );
      setMetadataHash(hashObject.hash);
    } catch (err) {
      console.error(err);
      console.log(err.byte);
      alert(err.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("submit");
  };

  const CenterRow = (props) => (
    <Row
      className={props.className + "d-flex justify-content-center"}
      {...props}
    ></Row>
  );

  return (
    <div className="App">
      <Container>
        <CenterRow>
          <Col className="mx-auto" xs={6} md={4}>
            <Image
              width="150px"
              src={process.env.PUBLIC_URL + "/solidity.png"}
            />
          </Col>
        </CenterRow>
        <CenterRow>Solidity metadata.json</CenterRow>
        <CenterRow>
          It is everything you need to reproduce a smart contract compilation
          and to verify its source
        </CenterRow>
        <CenterRow>
          <Col xs={12} md={4}>
            Choose Ethereum network
          </Col>
          <Col xs={12} md={4}>
            Connect Metamask
          </Col>
        </CenterRow>
        <Row className="d-flex justify-content-center">
          <CenterRow>
            <Form onSubmit={handleSubmit}>
              <Form.Label>Enter Contract Address</Form.Label>
              <Form.Control type="input" />
              <Button type="submit" variant="primary">
                Get Metadata
              </Button>
            </Form>
          </CenterRow>
        </Row>
      </Container>
    </div>
  );
}

export default App;
