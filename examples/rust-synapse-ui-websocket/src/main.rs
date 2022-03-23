use tungstenite::{connect, Message};
use url::Url;

fn attach() {
    let (mut socket, response) =
        connect(Url::parse("ws://localhost:24892/attach").unwrap()).expect("Can't connect");

    println!("Connected to the server");
    println!("Response HTTP code: {}", response.status());
    println!("Response contains the following headers:");
    for (ref header, _value) in response.headers() {
        println!("* {}", header);
    }

    socket.write_message(Message::Text("ATTACH".into())).unwrap();
    loop {
        let msg = socket.read_message().expect("Error reading message");
        println!("Received: {}", msg);
        if msg == Message::Text("ALREADY_ATTACHED".into()) || msg == Message::Text("READY".into()) {
            println!("Attached.");
            break;
        }
    
    }
    socket.close(None);
}
fn execute(code:&str) {
    let (mut socket, response) =
        connect(Url::parse("ws://localhost:24892/execute").unwrap()).expect("Can't connect");

    println!("Connected to the server");
    println!("Response HTTP code: {}", response.status());
    println!("Response contains the following headers:");
    for (ref header, _value) in response.headers() {
        println!("* {}", header);
    }

    socket.write_message(Message::Text(code.clone().into())).unwrap();
    loop {
        let msg = socket.read_message().expect("Error reading message");
        println!("Received: {}", msg);
        if msg == Message::Text("OK".into()) {
            println!("Executed code.");
            break;
        }
    }
    socket.close(None);
}

fn main () {
    attach();
    execute("print'poggers'")
}