import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import axios from 'axios';
// allow network debug in chrome
GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;

export default class App extends React.Component {
  state = {
    res: 1,
    count: 602,
    todos: {
      // 'id1': {
      //   name: 'todo1',
      //   description: 'desc1',
      //   status: 'planned',// closed, failed
      //   id: 'id1'
      // },
    }
  };
  pop = async () => {
    try {
      const res = await axios.get("http://localhost:3002/todos");
      this.setState({
        todos: res.data.todoArr
      });
      console.log(res.data.todoArr);
      console.log(this.state.todos);
    } catch (err) {
      console.log(err);
    }
  };
  sendIt = async () => {
    try {
      const res = await axios.post("http://localhost:3002/api/bookings", {
        data: { mers: +this.state.count + 1 }
      });
      this.setState((state) => {
        console.log(res);
        return {
          res: res && res.data.mers,
          count: +state.count + 1
        }
      });
      // console.log(this.state.count)
    } catch (err) {
      console.log(err)
    }
  }
  deleteTodo (el) {
    console.log(el)
  }
  async addTodo(el) {
    const res = await axios.post("http://localhost:3002/api/bookings", {
      data: {
        'id3': {
          name: 'todo3',
          description: 'desc3',
          status: 'planned',
          id: 'id3'
        }
      }
    });
    this.setState({
      todos: {
        ...this.state.todos,
        ...res.data,
      }
    })
  }
  componentDidMount() {
    this.pop();
  }
  render() {
    return (
    <View style={styles.wrapper}>
      <Text style={styles.header}>
        My ToDo's
      </Text>
      {
          Object.entries(this.state.todos).map(([key, entry]) => {
            return (
              <View key={key} style={styles.container}>
                <Text style={styles.todoName}>
                  {entry.name}
                </Text>
                <Text style={styles.todoDescr}>
                  {entry.description}
                </Text>
                <Button
                  onPress={this.deleteTodo.bind(this, key)}
                  title="x"
                />
              </View>
            )
          })
      }
      <View style={styles.todoAdd}>
          <Button
            onPress={this.addTodo.bind(this, "key")}
            title="+ Add"
          />
      </View>
    </View>
  )
  };
}

var styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    height: 48,
    alignItems: "center",
    margin: 10,
    backgroundColor: '#fff',
    elevation: 12,
  },
  todoName: {
    width: '20%',
    paddingLeft: 5,
  },
  todoDescr: {
    width: '72%',
  },
  todoAction: {
    width: 20,
  },
  todoAdd: {
    margin: 10,
    alignItems: "center",
    overflow: 'hidden'
  },
  wrapper: {
    marginTop: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});
