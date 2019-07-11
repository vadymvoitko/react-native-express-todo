import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import axios from 'axios';

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    height: "48px",
    alignItems: "center",
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: "grey",
    margin: "10px",
    boxShadow: "2px 2px 3px #c5bdbd",
  },
  todoName: {
    width: "20%",
  },
  todoDescr: {
    width: "60%",
  },
  todoAction: {
    width: "20%",
  },
  todoAdd: {
    margin: "10px auto",
    alignItems: "center",
  },
});
export default class App extends React.Component {
  state = {
    res: 1,
    count: 602,
    todos: {
      'id1': {
        name: 'todo1',
        description: 'desc1',
        status: 'planned',// closed, failed
        id: 'id1'
      },
      'id2': {
        name: 'todo2',
        description: 'desc2',
        status: 'closed',// closed, failed
        id: 'id2'
      }
    }
  }
  pop = async () => {
    const res = await axios.get("http://localhost:3002/api/bookings");
    this.setState({
      res: res && res.data.mers,
      count: res && res.data.mers,
    })
  }
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
    <View>
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
