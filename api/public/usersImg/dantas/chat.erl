-module(chat).
-export([server/1]).

server(Port) ->
    Rooms=#{ "default" => spawn(fun()-> room([]) end),
             "miei"    => spawn(fun()-> room([]) end),
             "cesium"  => spawn(fun()-> room([]) end),
             "caum"    => spawn(fun()-> room([]) end)
    },
    Users = usersProcessManager:start(),
    {ok, LSock} = gen_tcp:listen(Port, [binary, {packet, line}, {reuseaddr, true}]),
    acceptor(LSock, Rooms, Users).

acceptor(LSock, Rooms, Users) ->
    {ok, Sock} = gen_tcp:accept(LSock),
    spawn(fun() -> acceptor(LSock, Rooms, Users) end),
    loginManager(Sock, Rooms, Users).


loginManager(Sock, Rooms, UsersPM) ->
    receive
        {tcp, _, <<"create_account ", N/binary>>} ->
            Cred = binary_to_list(binary:part(N, {0, byte_size(N)-1})), %%para quem usa nc
            [Name, Pass] = string:split(Cred, " "),
            UsersPM ! {self(), reg, Name, Pass},
            loginManager(Sock, Rooms, UsersPM);
        {tcp, _, <<"close_account", N/binary>>} ->
            Cred = binary_to_list(binary:part(N, {0, byte_size(N)-1})),
            [Name, Pass] = string:split(Cred, " "),
            UsersPM ! {self(), unreg, Name, Pass},
            loginManager(Sock, Rooms, UsersPM);
        {tcp, _, <<"login ", N/binary>>} ->
            Cred = binary_to_list(binary:part(N, {0, byte_size(N)-1})), 
            [Name, Pass] = string:split(Cred, " "),
            UsersPM ! {self(), login, Name, Pass},
            loginManager(Sock, Rooms, UsersPM);
        {users_manager, reg, alreadyReg} ->
            gen_tcp:send(Sock, "You are already registered...logging in\n"),
            Room = maps:get("default",Rooms),
            Room ! {enter, self()},
            client:interface(Sock, Room, Rooms);
        {users_manager, reg, success} ->
            gen_tcp:send(Sock, "Success\n"),
            loginManager(Sock, Rooms, UsersPM);
        {users_manager, unreg, success} ->
            gen_tcp:send(Sock, "Success\n"),
            loginManager(Sock, Rooms, UsersPM);
        {users_manager, unreg, noUser} ->
            gen_tcp:send(Sock, "No user with those cridentials\n"),
            loginManager(Sock, Rooms, UsersPM);
        {users_manager, login, success} ->
            gen_tcp:send(Sock, "...logged in\n"),
            Room = maps:get("default",Rooms),
            Room ! {enter, self()},
            client:interface(Sock, Room, Rooms);
        {users_manager, login, notregistered} ->
            gen_tcp:send(Sock, "You are not registered\n"),
            loginManager(Sock, Rooms, UsersPM);
        _ ->
            gen_tcp:send(Sock, "Invalid command\n"),
            loginManager(Sock, Rooms, UsersPM)
    end.
 
room(Pids) ->
    receive
        {enter, Pid} ->
            io:format("user entered~n", []),
            room([Pid | Pids]);
        {line, Data} = Msg ->
            io:format("received ~p~n", [Data]),
            [Pid ! Msg || Pid <- Pids],
            room(Pids);
        {leave, Pid} ->
            io:format("user left~n", []),
            room(Pids -- [Pid])
    end.

parse(N) -> Cred = binary_to_list(binary:part(N, {0, byte_size(N)-1})), %%para quem usa nc
            string:split(Cred, " ").