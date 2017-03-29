const Time = require('../models/time');

module.exports = {
  listarTodos: listarTodos,
  listarTime: listarTime,
  seedTimes: seedTimes,
  listarAposIncluir: listarAposIncluir,
  incluirTime: incluirTime,
  listarAposEditar: listarAposEditar,
  editarTime: editarTime,
  excluirTime: excluirTime
}

function listarTodos(req, res) { 
  Time.find({}, (err, times) => {
    if (err) {
      res.status(404);
      res.send('Time não encontrado!');
    }

    //retorna a página com sucesso
    res.render('pages/times', { 
      times: times,
      success: req.flash('success')
    });
  });
}

function listarTime(req, res) {
  Time.findOne({ slug: req.params.slug }, (err, time) => {
    if (err) {
      res.status(404);
      res.send('Time não encontrado!');
    }

    res.render('pages/single', { 
      time: time,
      success: req.flash('success')
    });
  });
}

function seedTimes(req, res) {
  // criando times
  const times = [
    { nome: 'Sport Club do Recife', descricao: 'Maior do Brasil' },
    { nome: 'Santa Cruz', descricao: 'Menor de Recife' },
    { nome: 'Nautico', descricao: 'Fracasso Total' },
    { nome: 'Salgueiro', descricao: 'Maior do Interior' }
  ];

  //usar time para inserir/salvar
  Time.remove({}, () => {
    for (time of times) {
      var newTime = new Time(time);
      newTime.save();
    }
  });

  //enviado!
  res.send('Database att!');
}

function listarAposIncluir(req, res) {
  res.render('pages/incluir', {
    errors: req.flash('errors')
  });
}

function incluirTime(req, res) {
  //validação dos dados informados
  req.checkBody('nome', 'Preencha o campo Nome').notEmpty();
  req.checkBody('descricao', 'Preencha o campo Descrição').notEmpty();

  //caso possua erro na validação, redirecionar e salvar no flash
  const errors = req.validationErrors();
  if (errors) {
    req.flash('errors', errors.map(err => err.msg));
    return res.redirect('/times/incluir');
  }

  //criar um novo time
  const time = new Time({
    nome: req.body.nome,
    descricao: req.body.descricao
  });

  //salvar o time
  time.save((err) => {
    if (err)
      throw err;

    //mensagem de sucesso 
    req.flash('success', 'Cadastrado com sucesso!');

    //redireciona ao time criado
    res.redirect(`/times/${time.slug}`);
  });
}

function listarAposEditar(req, res) {
  Time.findOne({ slug: req.params.slug }, (err, time) => {
    res.render('pages/editar', {
      time: time,
      errors: req.flash('errors')
    });
  });
}

function editarTime(req, res) {
  //validar os dados
  req.checkBody('nome', 'Preencha o campo Nome').notEmpty();
  req.checkBody('descricao', 'Preencha o campo Descrição').notEmpty();

  //caso possua erros, redirecionar e salvar os erros no flash
  const errors = req.validationErrors();
  if (errors) {
    req.flash('errors', errors.map(err => err.msg));
    return res.redirect(`/times/${req.params.slug}/editar`);
  }

    Time.findOne({ slug: req.params.slug }, (err, time) => {
    //atualizando time
    time.nome        = req.body.nome;
    time.descricao = req.body.descricao;

    time.save((err) => {
      if (err)
        throw err;

      //mensagem flash de sucesso
      //redireciona de volta a /time
      req.flash('success', 'Atualizado com sucesso!');
      res.redirect('/times');
    });
  });

}

function excluirTime(req, res) {
  Time.remove({ slug: req.params.slug }, (err) => {
    //flash data
    //redireciona de volta a pagina de times
    req.flash('success', 'Deletado com sucesso!');
    res.redirect('/times');
  });
}