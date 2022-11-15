import { FunctionDeclaration, Program, VarDeclaration } from "../../frontend/ast.ts";
import Environment from "../environment.ts";
import { evaluate } from "../interpreter.ts";
import { MK_NULL, RuntimeVal } from "../values.ts";

export function eval_program(program: Program, env: Environment): RuntimeVal {
  let lastEvaluated: RuntimeVal = MK_NULL();
  for (const statement of program.body) {
    lastEvaluated = evaluate(statement, env);
  }
  return lastEvaluated;
}

export function eval_var_declaration(
  declaration: VarDeclaration,
  env: Environment,
): RuntimeVal {
  const value = declaration.value
    ? evaluate(declaration.value, env)
    : MK_NULL();

  return env.declareVar(declaration.identifier, value, declaration.constant);
}

export function eval_function_declaration(
  declaration: FunctionDeclaration,
  env: Environment,
): RuntimeVal {
  // What to do here?
  // We have a function *declaration* that comprises an identifier, parameters and a body
  // ostensibly that should be it's own environment, with the params being local to that environment,
  // can they be constant? I would guess not. How does this interact with a function invocation?
  // if at all?
  // and then what of the body?
  const parent = env;
  const self = new Environment(parent);
  
  const {identifier, params, body} = declaration;
  params.forEach(param => {
    // declare 'let' for each param
    self.declareVar(param, MK_NULL(), false)
  })
  body.statements.forEach(stmt => evaluate(stmt, self))

  // What on earth am I trying here?
  // Somehow to make use of the identifier by 
  // letting the parent scope access it by name
  // but then what's the value it needs to pass?
  return env.declareVar(identifier, self, true)
  
}