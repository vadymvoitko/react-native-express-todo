import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import axios from 'axios';
// allow network debug in chrome
// GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;

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
      const res = await axios.get("http://localhost:3000/todos");
      res && res.data && res.data.forEach((el) => {
        this.setState((state) => {
          return {
            todos: {
              ...state.todos,
              [el._id]: el
            }
          };
        });
      })
    } catch (err) {
      console.log(err);
    }
  };
  async deleteTodo (key) {
    console.log(this.state.todos)
    const res = await axios.delete(`http://localhost:3000/todos/${key}`);
    this.setState((state) => {
      const newState = {...state.todos};
      delete newState[res.data];
      console.log(res);
      return {
        todos: newState
      };
    })
  }
  async addTodo(el) {
    const res = await axios.post("http://localhost:3000/todos", {
      data: {
        name: "todo3",
        description: "desc3",
        status: "planned"
      }
    });
    console.log(res);
    this.setState({
      todos: {
        ...this.state.todos,
        [res.data._id]: res.data,
      }
    })
    console.log(this.state)
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
