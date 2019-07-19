import React from 'react';
import { StyleSheet, Button, Modal, Text, TouchableHighlight, View, TextInput, Picker } from 'react-native';
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
    },
    modalVisible: false,
    name: '',
    description: '',
    statusCurrent: 'planned',

  };
  pop = async () => {
    try {
      const res = await axios.get("http://localhost:3000/todos");
      console.log('res', res);
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
      console.log("err ", err);
    }
  };
  deleteTodo = async (key) => {
    const res = await axios.delete(`http://localhost:3000/todos/${key}`);
    this.setState((state) => {
      const newState = {...state.todos};
      delete newState[res.data];
      return {
        todos: newState
      };
    })
  }
  editTodoInput = async (key, entry, description) => {
    this.setState({
      todos: {
        ...this.state.todos,
        [key]: {
          ...entry,
          description
        },
      }
    })
  }
  editTodoSave = async (key, description) => {
    try {
      console.log('1 ', this.state);
      const res = await axios.put(`http://localhost:3000/todos/${key}`, {
        data: {
          description
        }
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      console.log('2 ', res);
      this.setState({
        todos: {
          ...this.state.todos,
          [res.data._id]: {
            ...res.data,
            edit: false
          },
        },
      })
    } catch (err) {
      console.log(err);
    }
  }
  addTodo = async() => {
    try {
      const res = await axios.post("http://localhost:3000/todos", {
        data: {
          name: this.state.name,
          description: this.state.description,
          status: this.state.statusCurrent
        }
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      this.setState({
        todos: {
          ...this.state.todos,
          [res.data._id]: res.data,
        },
        modalVisible: false,
      })
    } catch (err) {
      console.log(err);
    }
  }
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
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
                {
                  !entry.edit
                      ? <Text
                          style={styles.todoDescr}
                          onPress={() => {
                            this.setState({
                              todos: {
                                ...this.state.todos,
                                [key]: {
                                  ...entry,
                                  edit: true
                                },
                              }
                            })
                          }}
                        >
                          {entry.description}
                        </Text>
                      : <>
                          <TextInput
                              style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                              placeholder="description"
                              onChangeText={this.editTodoInput.bind(this, key, entry)}
                              value={entry.description}
                          />
                          <Button
                              onPress={this.editTodoSave.bind(this, key, entry.description)}
                              title="Save"
                          />
                        </>
                }
                <Button
                  onPress={this.deleteTodo.bind(this, key)}
                  title="x"
                />
              </View>
            )
          })
      }
      <View style={styles.todoAddWrapper}>
        <Modal
            animationType="fade"
            visible={this.state.modalVisible}>
          <View style={styles.modalWrapper}>
            <View>
              <Text>Enter details for new ToDo!</Text>
              <TextInput
                  style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                  placeholder="name"
                  onChangeText={(name) => this.setState({name})}
                  value={this.state.name}
              />
              <TextInput
                  style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                  placeholder="description"
                  onChangeText={(description) => this.setState({description})}
                  value={this.state.description}
              />
              <View>
                <Text>
                  Status
                </Text>
                <Picker
                    selectedValue={this.state.status}
                    style={{height: 50, width: 100}}
                    onValueChange={(itemValue, itemIndex) =>
                        this.setState({status: itemValue})
                    }>
                  <Picker.Item label="Planned" value="planned" />
                  <Picker.Item label="Done" value="done" />
                  <Picker.Item label="In Progress" value="inProgress" />
                </Picker>
              </View>
              <Button
                  onPress={this.addTodo}
                  title="Submit"
              />
              <TouchableHighlight
                  onPress={() => {
                    this.setModalVisible(!this.state.modalVisible);
                  }}>
                <Text>Hide Modal</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>

        <TouchableHighlight
            style={styles.todoAdd}
            onPress={() => {
              this.setModalVisible(true);
            }}>
          <Text>+ Add</Text>
        </TouchableHighlight>
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
    overflow: 'hidden',
    backgroundColor: 'cyan',
    width: 60,
    height: 30,
    paddingTop: 4,
    paddingRight: 1,
    borderRadius: 5,
  },
  wrapper: {
    marginTop: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  todoAddWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  modalWrapper: {
    height: 100,
  },
  setStatus: {
    flex: 1,
  }
});
