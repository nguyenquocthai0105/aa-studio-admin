import Button from "../../components/common/Button/Button";

function Login() {
  return (
    <div
      style={{
        width: "300px",
        margin: "100px auto",
      }}
    >
      <Button>Login</Button>

      <br />
      <br />

      <Button variant="secondary">
        Secondary
      </Button>

      <br />
      <br />

      <Button variant="danger">
        Delete
      </Button>

      <br />
      <br />

      <Button loading>
        Login
      </Button>
    </div>
  );
}

export default Login;