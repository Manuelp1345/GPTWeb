import "./App.css";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
} from "@mui/material";

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const scrollView = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSendMessage = async () => {
    if (inputValue !== "") {
      setLoading(true);

      const newMessages = [{ user: "Me", message: inputValue }];
      setMessages([...messages, ...newMessages]);
      setInputValue("");

      let response;
      try {
        response = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: inputValue,
          temperature: 0.3,
          max_tokens: 1500,
        });
        newMessages.push({
          user: "GPT",
          message: response.data.choices[0].text,
        });
      } catch (error) {
        newMessages.push({
          user: "Error",
          message: "Fallo tu pregunta, intenta hacerla de nuevo",
        });
      }

      setLoading(false);
      setMessages([...messages, ...newMessages]);
    }
  };

  useEffect(() => {
    // Hacer scroll automático a la parte inferior de la lista
    scrollView.current.scrollTop = scrollView.current.scrollHeight;
  }, [messages]);

  return (
    <div
      sx={{
        height: "100vh",
      }}
    >
      <Grid container>
        <Grid item xs={12}>
          <Paper
            sx={{
              width: "100%",
              height: "100vh",
              background: "gray",
            }}
          >
            <List
              ref={scrollView}
              sx={{
                height: "80vh",
                overflowY: "auto",
              }}
            >
              {messages.map((message, index) => (
                <ListItem key={index}>
                  <ListItemText
                    sx={{
                      color: "red",
                    }}
                    align={message.user === "Me" ? "right" : "left"}
                    primary={message.user}
                    secondary={message.message}
                  />
                </ListItem>
              ))}
            </List>
            <Grid container>
              <Grid item xs={11}>
                <TextField
                  placeholder="Escribe un mensaje"
                  fullWidth
                  disabled={loading}
                  onChange={handleInputChange}
                  value={inputValue}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
              </Grid>
              <Grid item xs={1}>
                <Button
                  disabled={loading}
                  variant="contained"
                  color="primary"
                  onClick={handleSendMessage}
                >
                  Enviar
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
export default App;
