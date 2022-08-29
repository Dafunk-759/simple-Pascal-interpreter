program Factorial;
var 
  ret, n : integer;
begin
  ret := 1;
  n := 5;

  if (n < 0) assert(0)
  else if (n = 0) ret := 1
  else begin
    while(n > 0) begin
      ret := ret * n;
      n := n - 1
    end
  end;

  log(ret)
end.