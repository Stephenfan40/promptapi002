const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3002;

// 允许跨域请求
app.use(cors());
// 解析 json 请求体
app.use(express.json());

// 获取所有 prompt 数据
app.get('/api/prompt', (req, res) => {
  fs.readFile('promptdata.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('读取数据失败');
    } else {
      res.send(JSON.parse(data));
    }
  });
});

// 新增一个 API 接口，返回 promptdata.json 的所有数据
app.get('/api/all-prompts', (req, res) => {
  fs.readFile('promptdata.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('读取数据失败');
    } else {
      res.send(JSON.parse(data));
    }
  });
});


// 获取指定 ID 的 prompt 数据
app.get('/api/prompt/:id', (req, res) => {
  fs.readFile('promptdata.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('读取数据失败');
    } else {
      const prompts = JSON.parse(data);
      const prompt = prompts.find(p => p.id.toString() === req.params.id);

      if (prompt) {
        res.send(prompt);
      } else {
        res.status(404).send('未找到指定 ID 的提示');
      }
    }
  });
});

// 新增 prompt 数据
app.post('/api/prompt', (req, res) => {
  const newData = req.body;

  if (
    !newData ||
    !newData.title ||
    !newData.description ||
    !newData.imageUrl ||
    !newData.type ||
    !newData.attention_note ||
    !newData.example_question ||
    !newData.example_answer
  ) {
    res.status(400).send('请求数据无效');
    return;
  }

  fs.readFile('promptdata.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('读取数据失败');
    } else {
      const prompt = JSON.parse(data);
      if (prompt.length === 0) {
        newData.id = 1;
      } else {
        newData.id = prompt[prompt.length - 1].id + 1;
      }
      prompt.push(newData);

      // 将新数据写入文件
      fs.writeFile('promptdata.json', JSON.stringify(prompt), 'utf8', (err) => {
        if (err) {
          res.status(500).send('保存数据失败');
        } else {
          res.status(201).send('数据保存成功');
        }
      });
    }
  });
});

// 更新指定 ID 的 prompt 数据
app.put('/api/prompt/:id', (req, res) => {
  const idToUpdate = parseInt(req.params.id);
  const updatedData = req.body;

  if (
    !updatedData ||
    !updatedData.title ||
    !updatedData.description ||
    !updatedData.imageUrl ||
    !updatedData.type ||
    !updatedData.attention_note ||
    !updatedData.example_question ||
    !updatedData.example_answer
  ) {
    res.status(400).send('请求数据无效');
    return;
  }

  fs.readFile('promptdata.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('读取数据失败');
    } else {
      const prompt = JSON.parse(data);
      const dataIndex = prompt.findIndex((item) => item.id === idToUpdate);

      if (dataIndex === -1) {
        res.status(404).send('未找到要更新的数据');
      } else {
                updatedData.id = idToUpdate;
        prompt[dataIndex] = updatedData;

        // 将更新后的数据写入文件
        fs.writeFile('promptdata.json', JSON.stringify(prompt), 'utf8', (err) => {
          if (err) {
            res.status(500).send('更新数据失败');
          } else {
            res.status(200).send('数据更新成功');
          }
        });
      }
    }
  });
});

// 删除指定 ID 的 prompt 数据
app.delete('/api/prompt/:id', (req, res) => {
  const idToDelete = parseInt(req.params.id);

  fs.readFile('promptdata.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('读取数据失败');
    } else {
      const prompt = JSON.parse(data);
      const dataIndex = prompt.findIndex((item) => item.id === idToDelete);
      if (dataIndex === -1) {
        res.status(404).send('未找到要删除的数据');
      } else {
        prompt.splice(dataIndex, 1);
        // 将删除后的数据写入文件
        fs.writeFile('promptdata.json', JSON.stringify(prompt), 'utf8', (err) => {
          if (err) {
            res.status(500).send('删除数据失败');
          } else {
            res.status(200).send('数据删除成功');
          }
        });
      }
    }
  });
});

// 启动服务器，监听指定端口
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

