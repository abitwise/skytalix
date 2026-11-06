import ctypes, os, struct
libc = ctypes.CDLL(None, use_errno=True)
fd = os.open("/tmp", os.O_RDONLY)
buf = ctypes.create_string_buffer(72)
cmd = ((0x800007 << 8) | 0) & 0xffffffff
r = libc.syscall(443, fd, ctypes.c_uint(cmd), ctypes.c_int(os.getuid()), buf)
print("rc", r, "errno", ctypes.get_errno())
if r == 0:
    bh, bs, cur, ih, isoft, ci, bt, it = struct.unpack("8Q", buf.raw[:64])
    print("hard kB", bh, "soft kB", bs, "cur kB", cur // 1024, "inodes", ci, "ihard", ih)
